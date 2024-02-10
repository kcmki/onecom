
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
