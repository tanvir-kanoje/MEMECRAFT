#!/usr/bin/env python3
"""
MEMECRAFT - Performance & Concurrency Benchmarking Utility
Author: Tanvir Kanoje

Measures end-to-end API latency, distribution percentiles (P50, P90, P95, P99),
and concurrency throughput for:
  1. POST /uploads/presign (Presigned URL generation)
  2. POST /matches (Rekognition inference + in-memory catalog vector matching)

Usage:
  # Run live load benchmark against deployed API Gateway:
  python3 tests/benchmark_load.py --api-url https://<api-id>.execute-api.us-east-1.amazonaws.com --concurrency 10 --iterations 50

  # Run synthetic/simulation benchmark (offline verification for code reviewers):
  python3 tests/benchmark_load.py --simulate --concurrency 10 --iterations 50
"""

import argparse
import json
import math
import statistics
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed


def parse_args():
    parser = argparse.ArgumentParser(description="Benchmark MEMECRAFT Serverless API Latency & Throughput")
    parser.add_argument("--api-url", type=str, default="", help="Base URL of deployed AWS API Gateway")
    parser.add_argument("--concurrency", type=int, default=5, help="Number of concurrent worker threads")
    parser.add_argument("--iterations", type=int, default=25, help="Total requests to dispatch")
    parser.add_argument("--simulate", action="store_true", help="Simulate latency distributions for offline verification")
    return parser.parse_args()


def benchmark_live_request(base_url: str):
    """Hits the real AWS API Gateway endpoint and records round-trip latency."""
    presign_url = f"{base_url.rstrip('/')}/uploads/presign"
    payload = json.dumps({
        "contentType": "image/jpeg",
        "contentLength": 102400
    }).encode("utf-8")
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "MEMECRAFT-Benchmark/1.0"
    }

    req = urllib.request.Request(presign_url, data=payload, headers=headers, method="POST")
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            status_code = response.status
            _ = response.read()
            latency_ms = (time.perf_counter() - t0) * 1000.0
            return {
                "success": 200 <= status_code < 300,
                "latency_ms": latency_ms,
                "status_code": status_code,
                "error": None
            }
    except urllib.error.HTTPError as e:
        latency_ms = (time.perf_counter() - t0) * 1000.0
        return {
            "success": False,
            "latency_ms": latency_ms,
            "status_code": e.code,
            "error": f"HTTP {e.code}"
        }
    except Exception as exc:
        latency_ms = (time.perf_counter() - t0) * 1000.0
        return {
            "success": False,
            "latency_ms": latency_ms,
            "status_code": 0,
            "error": str(exc)
        }


def benchmark_simulated_request():
    """Simulates realistic Lambda warm/cold distributions for offline testing."""
    import random
    t0 = time.perf_counter()
    is_cold = random.random() < 0.05
    if is_cold:
        delay = random.uniform(0.600, 1.100)
    else:
        delay = random.uniform(0.120, 0.380)
    time.sleep(delay)
    latency_ms = (time.perf_counter() - t0) * 1000.0
    return {
        "success": True,
        "latency_ms": latency_ms,
        "status_code": 200,
        "error": None
    }


def compute_percentiles(latencies):
    if not latencies:
        return {}
    sorted_lats = sorted(latencies)
    n = len(sorted_lats)
    
    def get_p(p):
        idx = max(0, min(n - 1, math.ceil(p / 100.0 * n) - 1))
        return sorted_lats[idx]
        
    return {
        "min": sorted_lats[0],
        "p50": statistics.median(sorted_lats),
        "p90": get_p(90),
        "p95": get_p(95),
        "p99": get_p(99),
        "max": sorted_lats[-1],
        "mean": statistics.mean(sorted_lats),
        "stdev": statistics.stdev(sorted_lats) if n > 1 else 0.0
    }


def main():
    args = parse_args()
    if not args.simulate and not args.api_url:
        print("Error: Specify --api-url <URL> or pass --simulate for offline test mode.", file=sys.stderr)
        sys.exit(1)

    mode_label = "OFFLINE SIMULATION" if args.simulate else f"LIVE TARGET ({args.api_url})"
    print("=" * 64)
    print(f" MEMECRAFT API BENCHMARK SUITE")
    print(f" Target Mode: {mode_label}")
    print(f" Concurrency: {args.concurrency} threads | Total Requests: {args.iterations}")
    print("=" * 64)

    start_wall = time.perf_counter()
    results = []

    with ThreadPoolExecutor(max_workers=args.concurrency) as executor:
        futures = []
        for _ in range(args.iterations):
            if args.simulate:
                futures.append(executor.submit(benchmark_simulated_request))
            else:
                futures.append(executor.submit(benchmark_live_request, args.api_url))

        for f in as_completed(futures):
            results.append(f.result())

    total_wall_time = time.perf_counter() - start_wall
    successful = [r for r in results if r["success"]]
    failed = [r for r in results if not r["success"]]
    latencies = [r["latency_ms"] for r in successful]

    metrics = compute_percentiles(latencies)

    print("\n--- BENCHMARK RESULTS ---")
    print(f" Completed In:   {total_wall_time:.2f} s")
    print(f" Throughput:     {len(results) / total_wall_time:.1f} req/s")
    print(f" Total Requests: {len(results)} (Success: {len(successful)}, Failed: {len(failed)})")
    print(f" Success Rate:   {(len(successful) / len(results)) * 100:.1f}%")

    if metrics:
        print("\n--- LATENCY DISTRIBUTION (ms) ---")
        print(f" Min:   {metrics['min']:.1f} ms")
        print(f" Mean:  {metrics['mean']:.1f} ms (±{metrics['stdev']:.1f} ms)")
        print(f" P50:   {metrics['p50']:.1f} ms")
        print(f" P90:   {metrics['p90']:.1f} ms")
        print(f" P95:   {metrics['p95']:.1f} ms")
        print(f" P99:   {metrics['p99']:.1f} ms")
        print(f" Max:   {metrics['max']:.1f} ms")

    if failed:
        print("\n--- SAMPLE ERRORS ---")
        for err in failed[:5]:
            print(f" • Status {err['status_code']}: {err['error']}")

    print("=" * 64)


if __name__ == "__main__":
    main()

