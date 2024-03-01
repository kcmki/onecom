"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay} from 'swiper/modules';
import { useRef, useState } from 'react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { root } from 'postcss';

export default function Slider({images,mainColor,secondColor}){

    let [Images, setImages] = useState(images);
    if (typeof window !== "undefined") {
        document.documentElement.style.setProperty('--swiper-theme-color', secondColor);
      }
    

    return (
      <Swiper autoplay={{delay:5000,pauseOnMouseEnter:true,}} navigation pagination={{clickable: true,}} loop={true} modules={[Navigation,Pagination,Autoplay]}>
        {
          Images.map((image, index) => (
            <SwiperSlide key={index} >
              <img src={image} alt={`image-${index}`} />
            </SwiperSlide>
          ))
        }
      </Swiper>
    )
  }