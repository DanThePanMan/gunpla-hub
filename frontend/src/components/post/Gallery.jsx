import React, { useState } from "react";

export default function Gallery({ pictures }) {
    const [index, setIndex] = useState(0);
    if (!Array.isArray(pictures) || pictures.length === 0) return null;

    const prev = (e) => {
        e?.stopPropagation();
        setIndex((i) => (i === 0 ? pictures.length - 1 : i - 1));
    };
    const next = (e) => {
        e?.stopPropagation();
        setIndex((i) => (i === pictures.length - 1 ? 0 : i + 1));
    };

    return (
        <div className="bg-slate-900 rounded border border-slate-700 p-3 mb-4">
            <div className="relative flex items-center justify-center">
                <img
                    src={pictures[index]}
                    alt={`post-image-${index}`}
                    className="max-h-[60vh] w-full object-contain rounded"
                    loading="lazy"
                />

                {pictures.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center">
                            &#8592;
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center">
                            &#8594;
                        </button>
                    </>
                )}
            </div>

            {pictures.length > 1 && (
                <div className="flex gap-2 justify-center mt-2">
                    {pictures.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-2 h-2 rounded-full ${
                                i === index ? "bg-white" : "bg-slate-600"
                            }`}></button>
                    ))}
                </div>
            )}
        </div>
    );
}
