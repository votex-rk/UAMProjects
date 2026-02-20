// Data Array: Easy to edit or fetch from an API later
const artworks = [
    { title: "Neon Solitude", desc: "A representation of urban isolation in the digital age.", img: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=600&q=80" },
    { title: "Abstract Flow", desc: "The chaotic yet harmonious movement of colors.", img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80" },
    { title: "Geometric Silence", desc: "Shapes defining the void of space.", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80" },
    { title: "Digital Dreams", desc: "What do androids dream of?", img: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&w=600&q=80" },
    { title: "Cyber Sunset", desc: "Nature reconstructed through code.", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
    { title: "Future Ruins", desc: "The beauty of decay in a futuristic setting.", img: "https://images.unsplash.com/photo-1614730341194-75c60740a2d3?auto=format&fit=crop&w=600&q=80" },
    { title: "Prism of Light", desc: "Refraction of light through the lens of time.", img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=600&q=80" }
];

// Selectors
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

// Modal Selectors
const modal = document.getElementById('art-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const closeModal = document.querySelector('.close-modal');

// State Variables
let currentAngle = 0;
const totalItems = artworks.length;
// Calculate the rotation angle per item (360 / 7 items = ~51.4 deg)
const theta = 360 / totalItems; 
// Calculate the distance from center (radius) needed to fit the cards
// Formula: r = (width / 2) / tan(theta / 2)
const radius = Math.round((260 / 2) / Math.tan(Math.PI / totalItems));

// --- INITIALIZATION ---

function initCarousel() {
    artworks.forEach((art, index) => {
        // Create Card Element
        const card = document.createElement('div');
        card.classList.add('card');
        
        // 3D Math: Rotate the card, then push it outward (translateZ)
        card.style.transform = `rotateY(${index * theta}deg) translateZ(${radius}px)`;
        
        // Insert Content
        card.innerHTML = `
            <img src="${art.img}" alt="${art.title}">
            <h3>${art.title}</h3>
        `;

        // Click Event for Zoom/Modal
        card.addEventListener('click', () => {
            openModal(art);
        });

        carousel.appendChild(card);
    });
}

// --- NAVIGATION LOGIC ---

function rotateCarousel(direction) {
    if (direction === 'next') {
        currentAngle -= theta;
    } else {
        currentAngle += theta;
    }
    // Apply rotation to the container
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${currentAngle}deg)`;
}

// Event Listeners for Buttons
nextBtn.addEventListener('click', () => rotateCarousel('next'));
prevBtn.addEventListener('click', () => rotateCarousel('prev'));

// Keyboard Navigation (User Experience)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') rotateCarousel('next');
    if (e.key === 'ArrowLeft') rotateCarousel('prev');
    if (e.key === 'Escape') closeModalFunc();
});

// --- MODAL LOGIC ---

function openModal(art) {
    modal.style.display = 'block';
    // Small timeout to allow CSS transition to catch the display change
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    modalImg.src = art.img;
    modalTitle.innerText = art.title;
    modalDesc.innerText = art.desc;
}

function closeModalFunc() {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 400); // Matches CSS transition time
}

closeModal.addEventListener('click', closeModalFunc);
// Close if clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
});

// --- AUDIO LOGIC ---

let isPlaying = false;
musicToggle.addEventListener('click', () => {
    if (!isPlaying) {
        bgMusic.play().then(() => {
            musicToggle.innerText = "Pause Ambience ⏸";
            isPlaying = true;
        }).catch(error => {
            console.log("Audio playback failed:", error);
        });
    } else {
        bgMusic.pause();
        musicToggle.innerText = "Play Ambience 🎵";
        isPlaying = false;
    }
});

// Run Initialization
initCarousel();