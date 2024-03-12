"use server"
import Footer from "../componements/Footer";
import Header from "../componements/Header"
import db from '/lib/db'

export default async function CommandesLayout({ children }) {
    let data = await db.collection('site').findOne({});
    if(!data){
        data = {
          mainColor: '#000000',
          secondColor: '#ffffff',
          logo: 'default-logo.png',
          name: 'My shop',
          images: []
      }}
    let mainColor = data.mainColor;
    let secondColor = data.secondColor;

    return(
        <>
        <Header logo={data.logo} mainColor={mainColor} name={data.name} secondColor={secondColor} />
        <div className="w-full p-10 small:p-2 flex flex-col justify-start items-center">
            <h1 className="text-2xl font-bold ">Commandes</h1>
            {children}
        </div>
        <Footer name={data.name} />
        </>
    )
}
