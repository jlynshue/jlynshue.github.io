function buildPath(pathname: string, params: Record<string, string | null | undefined>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function discoveryCallHref(placement: string) {
  return buildPath("/r/discovery-call", { placement });
}

export function leadMagnetHref(asset: string, placement: string) {
  return buildPath("/r/lead-magnet", { asset, placement });
}
