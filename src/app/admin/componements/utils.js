
export const AuthUpdate = async (setLogged,setLoading) => {
    let token = localStorage.getItem('sessionId') || '';
    console.log("Token =>"+token);
    let response = await fetch('/api/isLogged/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    let data = await response.json();
    if(data.success){
        console.log("Logged in as " + data.user.newSessionId)
        localStorage.setItem('sessionId',data.user.newSessionId)
    }else{
        localStorage.setItem('sessionId','')
        console.log("Not logged in" + data.message)
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
