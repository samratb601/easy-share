'use client'
import React from 'react'

export default function ButtonX({id}:{id:string}) {
  return (
    <button
    className="bg-sky-400 btn btn-sm px-3 rounded"
    onClick={() => {
      alert(`clicked item ${id}`);
    }}
  >
    Click
  </button>
  )
}
