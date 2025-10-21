'use client';

import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';

export default function Aos() {
    useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    }, []);
    return null;
}
