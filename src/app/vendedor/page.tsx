"use client";

import { useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";

export default function SellerForm() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    contact: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatNumber = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For MVP, we'll just create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // Store a simple reference instead of the full image data
        setFormData((prev) => ({ ...prev, imageUrl: file.name }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const dataToSave = {
        ...formData,
        year: formData.year.replace(/,/g, ""),
        price: formData.price.replace(/,/g, ""),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "sellerListings"), dataToSave);

      // Call the notification API
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        throw new Error("Error al enviar notificaciones");
      }

      setSuccess(true);
      setFormData({
        brand: "",
        model: "",
        year: "",
        price: "",
        contact: "",
        imageUrl: "",
      });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Error al guardar la información. Por favor intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "price") {
      setFormData((prev) => ({ ...prev, [name]: formatNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Publica tu carro</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium mb-2">
              Marca
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium mb-2">
              Modelo
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium mb-2">
              Año
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              pattern="[0-9,]*"
              inputMode="numeric"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Precio
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              pattern="[0-9,]*"
              inputMode="numeric"
              required
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium mb-2">
              Contacto (email o WhatsApp)
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="ejemplo@email.com o +521234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Foto del carro
            </label>
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {imagePreview && (
                <div className="relative w-full h-64">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {success && (
            <div className="text-green-600 text-sm">
              ¡Tu carro se ha publicado correctamente! Te contactaremos si hay
              compradores interesados.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publicando..." : "Publicar carro"}
          </button>
        </form>
      </div>
    </div>
  );
}
