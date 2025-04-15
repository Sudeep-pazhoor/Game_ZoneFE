import React from "react";
import { Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const gameImages = [
    "https://images.nintendolife.com/a8e44a44dac42/best-super-mario-games-of-all-time.900x.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8l6qlbmWVNuWdjxb8J_by_fQxhJY3bnOFOQ&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHgPTUVBCDIzeB1kiF-Mka38glUe4eevndpA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS0GdeCzeWm_vx0PkxH3AZCHZ4S5HUgskMyw&s",
    "https://images.crazygames.com/8-ball-pool-billiards-multiplayer_16x9/20240826034902/8-ball-pool-billiards-multiplayer_16x9-cover?auto=format,compress&q=75&cs=strip",
    "https://i.ytimg.com/vi/9aK2zoFBbKY/maxresdefault.jpg",
    "https://i.ytimg.com/vi/DeNNuA6ZlGY/maxresdefault.jpg"
];

const Landing = () => {
    const trackStyle = (direction) => ({
        display: "flex",
        gap: "20px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        width: "100%",
        animation: `${direction === "left" ? "scrollLeft" : "scrollRight"} 10s linear infinite`
    });

    return (
        <div
            style={{
                position: "relative", // absolute positioning of video
                minHeight: "100vh",color: "white",overflow: "hidden",display: "flex",
                flexDirection: "column",justifyContent: "space-between",
            }}
        >
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                style={{
                    position: "absolute", width: "100%", height: "100%",objectFit: "cover", zIndex: 0,opacity: 3, // opacity to make content readable
                }}>
                <source src="https://cdn.pixabay.com/video/2021/04/28/72488-543388303_large.mp4" type="video/mp4" />
                
            </video>

            {/* Overlay ===> readability */}
            <div
                style={{
                    position: "absolute",width: "100%",height: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1,
                }}
            ></div>

            
            <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ width: "100%", overflow: "hidden", display: "flex" }}>
                    <div style={trackStyle("left")}>
                        {gameImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Game ${index + 1}`}
                                style={{ height: "100px", width: "auto", borderRadius: "8px" }}
                            />
                        ))}
                    </div>
                </div>

                <Container className="text-center d-flex flex-column align-items-center justify-content-center flex-grow-1">
                    <div style={{ fontSize: "2rem" }}>
                        🎮 <span style={{ fontWeight: "bold" }}>GameZone</span>
                    </div>
                    <h1>Welcome to the Ultimate Gaming Experience!</h1>
                    <p>Discover a world of thrilling adventures and immersive gameplay.</p>
                    <Link to={'/auth'} className="btn btn-primary lg">
                        Explore More
                    </Link>
                </Container>

                <div style={{ width: "100%", overflow: "", display: "flex" }}>
                    <div style={trackStyle("right")}>
                        {gameImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Game ${index + 1}`}
                                style={{ height: "100px", width: "auto", borderRadius: "8px" }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scrollLeft {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }

                @keyframes scrollRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
};

export default Landing;