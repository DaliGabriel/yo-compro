import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function POST(request: Request) {
    try {
        const listing = await request.json();

        // Query for matching buyer requests - simplified to avoid composite index
        const buyerRequestsRef = collection(db, 'buyerRequests');

        // First, get all buyer requests for the same brand and model
        const brandModelQuery = query(
            buyerRequestsRef,
            where('brand', '==', listing.brand),
            where('model', '==', listing.model)
        );

        const matchingRequests = await getDocs(brandModelQuery);

        // Filter the results in memory for year and price ranges
        const filteredRequests = matchingRequests.docs.filter(doc => {
            const buyerRequest = doc.data();
            const year = parseInt(listing.year);
            const price = parseInt(listing.price);

            return (
                year >= parseInt(buyerRequest.minYear) &&
                year <= parseInt(buyerRequest.maxYear) &&
                price >= parseInt(buyerRequest.minPrice) &&
                price <= parseInt(buyerRequest.maxPrice)
            );
        });

        // Send emails to matching buyers
        const emailPromises = filteredRequests.map(async (doc) => {
            const buyerRequest = doc.data();

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: buyerRequest.contact,
                subject: '¡Encontramos un carro que coincide con tu búsqueda!',
                html: `
          <h1>¡Buenas noticias!</h1>
          <p>Hemos encontrado un carro que coincide con tu búsqueda:</p>
          <ul>
            <li>Marca: ${listing.brand}</li>
            <li>Modelo: ${listing.model}</li>
            <li>Año: ${listing.year}</li>
            <li>Precio: $${listing.price}</li>
          </ul>
          <p>Contacto del vendedor: ${listing.contact}</p>
          <p>¡No pierdas esta oportunidad!</p>
        `,
            };

            try {
                await transporter.sendMail(mailOptions);
                return { success: true, email: buyerRequest.contact };
            } catch (error) {
                console.error(`Error sending email to ${buyerRequest.contact}:`, error);
                return { success: false, email: buyerRequest.contact, error };
            }
        });

        const results = await Promise.all(emailPromises);
        const successfulEmails = results.filter(r => r.success).length;
        const failedEmails = results.filter(r => !r.success);

        return NextResponse.json({
            success: true,
            matches: filteredRequests.length,
            successfulEmails,
            failedEmails: failedEmails.length
        });
    } catch (error) {
        console.error('Error in notification:', error);
        return NextResponse.json(
            { error: 'Error al procesar las notificaciones' },
            { status: 500 }
        );
    }
} 