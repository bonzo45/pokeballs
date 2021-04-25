import { React, useEffect } from 'react';
import anime from 'animejs';

const diameter = 40;
// const translateLeft = Math.PI * diameter * (-25 / 260);
// const rotateLeft = '-25deg';
// const translateRight = Math.PI * diameter * (25 / 260);
// const rotateRight = '25deg';

export const Pokeball = ({index}) => {
    useEffect(() => {
        // anime({
        //     targets: '.ball1',
        //     keyframes: [
        //         {
        //             translateX: 0,
        //             rotate: '0deg',
        //         },
        //         {
        //             translateX: translateRight,
        //             rotate: rotateRight,
        //         },
        //         {
        //             translateX: translateLeft,
        //             rotate: rotateLeft,
        //         },
        //         {
        //             translateX: 0,
        //             rotate: '0deg',
        //         },
        //     ],
        //     easing: 'cubicBezier(0.450, 0.010, 0.010, 1.000)',
        //     duration: 1000,
        //     loop: 3,
        //     delay: anime.stagger(500),
        // });
        anime({
            targets: '.pokeball',
            keyframes: [
                {
                    scale: 1,
                },
            ],
            easing: 'cubicBezier(0.450, 0.010, 0.010, 1.000)',
            duration: 1000,
            loop: 3,
            delay: anime.stagger(100),
        });
    }, []);
    return <img
        style={{
            width: diameter,
            height: diameter,
            transform: `scale(0)`,
            // transform: `translateX(${Math.PI * 200 * (-25 / 360)}`
        }}
        className={`pokeball ball${index}`}
        src="/pokeball.svg"
        alt="pokeball"
    />;
}
