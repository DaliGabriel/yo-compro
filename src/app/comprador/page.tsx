"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function BuyerForm() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const formatNumber = (value: string) => {
    // Remove all non-digit characters
    const number = value.replace(/\D/g, "");
    // Format with commas
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert formatted numbers back to regular numbers before saving
      const dataToSave = {
        ...formData,
        minYear: formData.minYear.replace(/,/g, ""),
        maxYear: formData.maxYear.replace(/,/g, ""),
        minPrice: formData.minPrice.replace(/,/g, ""),
        maxPrice: formData.maxPrice.replace(/,/g, ""),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "buyerRequests"), dataToSave);
      setSuccess(true);
      setFormData({
        brand: "",
        model: "",
        minYear: "",
        maxYear: "",
        minPrice: "",
        maxPrice: "",
        contact: "",
      });
    } catch (err) {
      setError("Error al guardar la información. Por favor intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "minPrice" || name === "maxPrice") {
      setFormData((prev) => ({ ...prev, [name]: formatNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">¿Qué carro estás buscando?</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium mb-2">
              Marca deseada
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="minYear"
                className="block text-sm font-medium mb-2"
              >
                Año mínimo
              </label>
              <input
                type="text"
                id="minYear"
                name="minYear"
                value={formData.minYear}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                pattern="[0-9,]*"
                inputMode="numeric"
                required
              />
            </div>

            <div>
              <label
                htmlFor="maxYear"
                className="block text-sm font-medium mb-2"
              >
                Año máximo
              </label>
              <input
                type="text"
                id="maxYear"
                name="maxYear"
                value={formData.maxYear}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                pattern="[0-9,]*"
                inputMode="numeric"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="minPrice"
                className="block text-sm font-medium mb-2"
              >
                Precio mínimo
              </label>
              <input
                type="text"
                id="minPrice"
                name="minPrice"
                value={formData.minPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                pattern="[0-9,]*"
                inputMode="numeric"
                required
              />
            </div>

            <div>
              <label
                htmlFor="maxPrice"
                className="block text-sm font-medium mb-2"
              >
                Precio máximo
              </label>
              <input
                type="text"
                id="maxPrice"
                name="maxPrice"
                value={formData.maxPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                pattern="[0-9,]*"
                inputMode="numeric"
                required
              />
            </div>
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

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {success && (
            <div className="text-green-600 text-sm">
              ¡Tu información se ha guardado correctamente! Te contactaremos
              cuando encontremos opciones que coincidan con tu búsqueda.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Enviar información"}
          </button>
        </form>
      </div>
    </div>
  );
}
