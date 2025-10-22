const axios = require('axios');

export const shortenWhatsappLink = async (longUrl:string) => {
    try {
        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        return response.data; // Enlace acortado
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Enlace largo de WhatsApp
