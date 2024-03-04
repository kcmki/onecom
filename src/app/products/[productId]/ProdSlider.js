"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay,Thumbs,FreeMode} from 'swiper/modules';
import { useRef, useState } from 'react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';


export default function ProdSlider({images,mainColor,secondColor}){
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

    if (typeof window !== "undefined") {
        document.documentElement.style.setProperty('--swiper-theme-color', secondColor);
      }
    
    return (
      <>
      <Swiper className='mySlider' autoplay={{delay:5000,pauseOnMouseEnter:true,}} thumbs={{ swiper: thumbsSwiper }} navigation pagination={{clickable: true,}} loop={true} modules={[Navigation,Pagination,Autoplay,Thumbs]}>
        {
          images.map((image, index) => (
            <SwiperSlide className='mySliderSlide' key={index} >
              <img src={image} alt={`image-${index}`} />
            </SwiperSlide>
          ))
        }
      </Swiper>

      <Swiper className="myController" onSwiper={setThumbsSwiper} loop={true} spaceBetween={0}  slidesPerView={3}freeMode={true}watchSlidesProgress={true}modules={[FreeMode, Navigation, Thumbs]}>
          {
            images.map((image, index) => (
              <SwiperSlide key={index} className='myControllerSlide'>
                <img src={image} alt={`image-${index}`}  className="myControllerSlide"/>
              </SwiperSlide>
            ))
          }
        </Swiper>
    </>
    )
  }