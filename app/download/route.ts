const APK_SOURCE = "https://raw.githubusercontent.com/Hamzacreates/tvOS-27-/main/tvOS%2027%20stable.apk"

function unavailableResponse() {
  return new Response("The tvOS 27 APK is temporarily unavailable. Please try again shortly.", {
    status: 502,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}

export async function GET() {
  try {
    const upstream = await fetch(APK_SOURCE, { next: { revalidate: 3600 } })

    if (!upstream.ok || !upstream.body) return unavailableResponse()

    const headers = new Headers({
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": 'attachment; filename="tvOS 27 stable.apk"; filename*=UTF-8\'\'tvOS%2027%20stable.apk',
      "Content-Type": "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    })
    const contentLength = upstream.headers.get("content-length")

    if (contentLength) headers.set("Content-Length", contentLength)

    return new Response(upstream.body, { headers })
  } catch {
    return unavailableResponse()
  }
}
