
export const AuthUpdate = async (setLogged,setLoading) => {
    let token = localStorage.getItem('sessionId') || '';
    let response = await fetch('/api/login/isLogged/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    let data = await response.json();
    if(data.success){
        localStorage.setItem('sessionId',data.user.newSessionId)
    }else{
        localStorage.setItem('sessionId','')
        setLogged(false)
    }
    setLoading(false);
}

export const imageBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const data = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        });
    return data;
}

export const compressImage = (file, quality = 0.5) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = file;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.toBlob(
                    (blob) => resolve(blob),
                    file.type,
                    quality
                );
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};
