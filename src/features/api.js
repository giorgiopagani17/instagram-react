import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export function useProfileData(id) {
  const [profileData, setProfileData] = useState(null);
  const api_url = `http://localhost/instagram/profileinfo.php?user_id=${id}`;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(api_url);
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Gestire l'errore o visualizzare un messaggio all'utente
      }
    };

    fetchProfileData();
  }, [id]); // useEffect will re-run when id change

  return profileData;
} 

//-------UPLOAD POST-------//
export async function uploadPost(userId, blob, description) {
  const upload_path = 'http://localhost/instagram/uploadpost.php'; // Rimuovi l'ID dall'URL
  const formData = new FormData();
  const fileName = generateFileName();
  formData.append('userId', userId); // Includi l'ID dell'utente nel FormData
  formData.append('file', blob, fileName); // Aggiungi l'immagine al FormData
  formData.append('description', description);
  
  const response = await fetch(upload_path, {
      method: 'POST',
      body: formData
  });

  if (!response.ok) {
      throw new Error('Failed to upload image');
  }

  const data = await response.json();
  console.log('Image uploaded successfully:', data);
}

function generateFileName() {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 10000);
    return `${timestamp}_${randomNum}.jpg`;
}

//-------UPLOAD PROFILE IMAGE-------//
export async function uploadImageProfile(userId, blob) {
  const upload_path = 'http://localhost/instagram/uploadimgprofile.php';
  const formData = new FormData();
  const fileName = generateFileName();
  formData.append('file', blob, fileName); // Aggiungi l'immagine al FormData
  formData.append('user_id', userId); // Aggiungi l'ID dell'utente al FormData
  
  const response = await fetch(upload_path, {
      method: 'POST',
      body: formData
  });

  if (!response.ok) {
      throw new Error('Failed to upload image');
  }

  const data = await response.json();
  console.log('Image uploaded successfully:', data);
}

//-------USER POST-------//
export function useUserPost(id) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchUserPost() {
      try {
        const response = await axios.get('http://localhost/instagram/userpost.php', {
          params: {
              user_id: id
          }
        });
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const imageData = response.data; // Utilizza response.data invece di response.json()
        setImages(imageData);
      } catch (error) {
        console.error("Error fetching user images:", error);
      }
    }

    fetchUserPost();
  }, [id]);

  return images;
}

//-------EXPLORE POSTS-------//
export function useExplorePost(id) {
  const [imagesExplore, setImagesExplore] = useState([]);

  useEffect(() => {
    async function fetchUserPost() {
      try {
        const response = await axios.get('http://localhost/instagram/explorepost.php', {
          params: {
            loggedInUserId: id
          }
        });
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        // Ottieni i dati direttamente da response.data
        const imageData = response.data;
        setImagesExplore(imageData);
      } catch (error) {
        console.error("Error fetching user images:", error);
      }
    }

    fetchUserPost();
  }, [id]);

  return imagesExplore;
}

//-------SEARCH USER-------//
const fetchUsers = async (query) => {
  const url = 'http://localhost/instagram/searchutenti.php';
  const params = { search: query };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Errore durante il recupero degli utenti:', error);
    return []; // Ritorna un array vuoto in caso di errore
  }
};

export default fetchUsers;



