import { useState, useEffect } from "react";

const Timer = ({ initialTime, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    // Eğer initialTime değişirse timeLeft'i güncelle
    useEffect(() => {
        setTimeLeft(initialTime);
    }, [initialTime]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp(); // Süre dolduğunda çalıştırılır
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onTimeUp]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="timer relative  p-4  rounded-lg shadow-lg w-28 flex items-center justify-center">
            <p className="text-base font-bold text-black">{formatTime(timeLeft)}</p>
        </div>
    );
};

export default Timer;
