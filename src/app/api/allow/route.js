import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://api.ipify.org/?format=json')
    if (!res.ok) throw new Error('Gagal mengambil IP dari ipify')
    const data = await res.json()
    const ip = data.ip || ''

    const allowed = process.env.ALLOWED_IPS?.split(',').map(ip => ip.trim()) || []
    const isAllowed = allowed.includes(ip)

    return new NextResponse(String(isAllowed), {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    return new NextResponse('false', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
