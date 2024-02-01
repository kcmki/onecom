

export default function Admin({}){
    let logged = true;
    if(logged){
        return (
            <AdminPage />
        )
    }
    return (
        <Login />
    )
}

function AdminPage({}){
    return (
        <div>
            Admin logged in
        </div>
    )
}

function Login({}){
    return (
        <div>
            Please loggin
        </div>
    )
}