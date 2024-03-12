"use server"
import db from '/lib/db'
import MainPageProducts from './componements/MainPageProducts';
import Slider  from './componements/Slider';
import Header from './componements/Header';
import Footer from './componements/Footer';


export default async function Home() {

  let data = await db.collection('site').findOne({});
  let products = await db.collection('products').find({visible:true}).sort({ date: -1 }).limit(10).toArray();

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
    let logo = data.logo;
    let name = data.name;
    let images = data.images;


  return (
    <main className="flex flex-col items-center justify-between">
        <Header logo={logo} mainColor={mainColor} secondColor={secondColor} name={name} />
        <div className='medium:w-full w-3/4'>
          {
            images.length != 0 ? <Slider images={images} mainColor={mainColor} secondColor={secondColor}/> : null 
          }
          <MainPageProducts products={products} mainColor={mainColor} secondColor={secondColor}/>
        </div>
        <Footer name={name} />
    </main>
  );
}

