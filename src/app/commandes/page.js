"use server"
import Footer from "../componements/Footer";
import Header from "../componements/Header"
import db from '/lib/db'

export default async function Commandes(){
    let data = await db.collection('site').findOne({});
    let mainColor = data.mainColor;
    let secondColor = data.secondColor;

    return(
        <>
        <Header logo={data.logo} mainColor={mainColor} name={data.name} secondColor={secondColor} />
        <div>
            <h1>Commandes</h1>
        </div>
        <Footer name={data.name} />
        </>
    )
}