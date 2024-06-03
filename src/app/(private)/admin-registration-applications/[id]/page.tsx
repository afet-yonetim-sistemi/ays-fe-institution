'use client'
export default function Page({
  params,
}: {
  params: { slug: string; id: string }
}) {
  return <div>{params.id}</div>
}
