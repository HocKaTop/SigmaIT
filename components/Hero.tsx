"use client"

import Image from "next/image";
import CustomButton from "./CustomButton";

const Hero = () => {
    const handleScroll = () => {

    }
    return (
        <div className="hero">
            <div className="flex-1 pt-36 padding-x">

                <h1 className="hero__title">
                    Sigma IT School
                </h1>

                <p className="hero__subtitle">IT - не сложно, если ты SIGMA </p>

                <CustomButton 
                title ="explore"
                btnType="button"
                containerStyles="bd-primary-blue text-white rounded-full mt-10"
                handleClick ={handleScroll}
                />

            </div>
            <div className="hero__image-container">
                <div className="hero__image">
                    <Image src="/hero.png" alt="hero" fill className="object-contain"/>
                    </div>
                    <div className="hero__image-overlay"> </div>
                
            </div>
        </div>
        
    )
}

export default Hero