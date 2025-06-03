"use client"
import { useEffect, useState } from "react";
import elvxk from "./elvxk";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareX, Telescope } from "lucide-react";

export default function Home() {
  const [domain, setDomain] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allowed, setAllowed] = useState(null)
  const [isPtr, setIsPtr] = useState(null)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`${apiUrl}/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      })

      if (!res.ok) {
        if (res.status === 404) {
          setError('Record DNS tidak ditemukan.')
        } else {
          setError('Terjadi kesalahan.')
        }
        return
      }

      const data = await res.json()
      const ptr = data.ptr
      const hasPtr = Array.isArray(ptr) ? ptr.length > 0 : !!ptr
      setIsPtr(hasPtr)
      setResult(data)
    } catch (err) {
      setError('Gagal menghubungi server.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    console.info(elvxk);
    fetch('/api/allow')
      .then(res => res.text())
      .then(text => setAllowed(text === 'true'))
      .catch(() => setAllowed(false))
  }, []);

  return (

    <div className="container mx-auto px-6">
      <div className="min-h-screen py-4 pt-6 flex flex-col gap-8 lg:gap-10 relative">
        <Image
          src="/lookup.webp"
          alt="Logo Lookup"
          width={366}
          height={180}
          className="hover:scale-110 self-center hover:-rotate-3 transition-all hover:cursor-cell"
          draggable={false}
          priority
        />
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Masukkan domain..."
            value={domain}

            onChange={(e) => setDomain(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Lookup'}
          </Button>
        </form>
        {error && (
          <Card className="bg-white flex justify-center items-center">
            <CardContent className="flex flex-col justify-center items-center gap-2">
              <MessageSquareX size={40} />
              <h1>
                {error}
              </h1>
            </CardContent>
          </Card>
        )}

        {result && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(result)
                .filter(([key]) => !['domain', 'spfIp', 'ptr'].includes(key))
                .map(([key, val]) => {
                  const count = Array.isArray(val) ? val.length : val ? 1 : 0
                  if (count === 0) return null

                  const label = `${count} ${key.toUpperCase()} Record${count > 1 ? 's' : ''}`

                  return (
                    <Card key={key} className="bg-white">
                      <CardContent>
                        <div className="font-semibold text-lg flex items-center gap-2 mb-2">
                          <Telescope size={20} /> Found {label}
                        </div>
                        {Array.isArray(val) ? (
                          <ul className="list-disc list-inside text-sm text-gray-700 break-words whitespace-pre-wrap flex flex-col gap-2">
                            {val.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-700">{val}</p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}

            </div>
            {allowed && isPtr &&
              <Card className="bg-white">
                <CardContent className="flex flex-col justify-center items-center">
                  <img src="https://static-00.iconduck.com/assets.00/openvpn-icon-2048x2048-crty1636.png" alt="openVPN" className="h-7 w-7" />
                  <h1 className="mb-2 text-lg">Hallo Sobat VPN</h1>
                  {Object.entries(result)
                    .filter(([key]) => key === 'ptr')
                    .map(([key, val]) => {
                      const count = Array.isArray(val) ? val.length : val ? 1 : 0
                      if (count === 0) return null
                      return (
                        <div key={key}>
                          <div className="opacity-75 flex flex-col items-center">
                            <p key={key}>Domain {domain} memiliki SPF record yang mengarah ke server berikut</p>
                            {Array.isArray(val) ? (
                              val.map((item, index) => (
                                <p className="text-lg font-bold text-red-800" key={index}>{item}</p>
                              ))
                            ) : (
                              <p className="text-lg font-bold text-red-800">{val}</p>
                            )}
                            <p>
                              silahkan masukkan script berikut pada teleport di server tersebut untuk mengetahui user cPanel nya
                            </p>
                          </div>
                          <Card className="px-4 py-2 bg-slate-600 m-4 font-light">
                            <CardContent>
                              <span className="text-yellow-300">grep</span>{" "}<span className="opacity-70 text-white">-rl</span>{" "}<span className="text-cyan-300">"{domain}"</span>{" "}<span className="text-white">/var/cpanel/userdata</span>
                            </CardContent>
                          </Card>
                          <p className="opacity-75">akan menghasilkan output sebagai berikut kemudian cari susupect <span className="text-red-800 font-bold">username</span> cPanel pada whmcs</p>
                          <Card className="px-4 py-2 bg-slate-600 m-4 font-light">
                            <CardContent>
                              <span className="text-white">/var/cpanel/userdata/</span><span className="text-cyan-300">username</span><span className="text-white">/</span>
                            </CardContent>
                          </Card>
                        </div>
                      )
                    })}
                </CardContent>
              </Card>}
          </>
        )}
        <div className="min-h-20"></div>
        <Footer />
      </div>
    </div>
  );
}
