import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

interface Artist {
  name: string;
  specialty: string;
  image: string;
  instagram: string;
  instagramHandle: string;
  bio: string;
  experience: string;
  styles: string[];
}

interface Work {
  id: number;
  image: string;
  style: string;
  artist: string;
}

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  scrolled = false;
  mobileMenuOpen = false;
  
  // Artist Profile Modal
  selectedArtist: Artist | null = null;
  artistWorks: Work[] = [];

  // Artists data
  artists: Artist[] = [
    {
      name: 'JUANPA CARCAMO',
      specialty: 'Realismo & Retratos',
      image: 'https://images.unsplash.com/photo-1611042553365-9b101441c135?w=400&h=500&fit=crop&crop=face',
      instagram: 'https://instagram.com',
      instagramHandle: '@juanpacarcamo',
      bio: 'Especialista en realismo con más de 8 años de experiencia. Su pasión por el detalle y la precisión lo han convertido en uno de los artistas más solicitados para retratos y piezas hiperrealistas.',
      experience: '8 años',
      styles: ['Realismo', 'Retratos', 'Black & Grey', 'Color Realismo']
    },
    {
      name: 'ABRAHAM',
      specialty: 'Blackwork & Geométrico',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
      instagram: 'https://instagram.com',
      instagramHandle: '@abraham_ink',
      bio: 'Maestro del blackwork y los diseños geométricos. Abraham combina patrones ancestrales con técnicas modernas para crear piezas únicas que destacan por su precisión y simetría perfecta.',
      experience: '6 años',
      styles: ['Blackwork', 'Geométrico', 'Tribal', 'Mandala']
    },
    {
      name: 'KEVIN',
      specialty: 'Neotradicional & Color',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
      instagram: 'https://instagram.com',
      instagramHandle: '@kevin_tattoo',
      bio: 'Apasionado por el color vibrante y las líneas audaces del estilo neotradicional. Kevin transforma ideas clásicas en obras de arte contemporáneas llenas de vida y movimiento.',
      experience: '5 años',
      styles: ['Neotradicional', 'Color', 'Old School', 'Ilustrativo']
    },
    {
      name: 'IÑAKI',
      specialty: 'Tradicional Japonés',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
      instagram: 'https://instagram.com',
      instagramHandle: '@inaki_tatt',
      bio: 'Dedicado al arte tradicional japonés (Irezumi). Iñaki estudió las técnicas ancestrales y las aplica con respeto a la tradición, creando piezas que cuentan historias a través de dragones, koi y flores de cerezo.',
      experience: '7 años',
      styles: ['Japonés Tradicional', 'Irezumi', 'Oriental', 'Koi']
    },
    {
      name: 'ALEXA',
      specialty: 'Fineline & Minimalista',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face',
      instagram: 'https://instagram.com',
      instagramHandle: '@alexa_ink',
      bio: 'Especialista en líneas finas y diseños minimalistas. Alexa cree que menos es más, y sus tatuajes delicados demuestran que la belleza está en la simplicidad y la elegancia.',
      experience: '4 años',
      styles: ['Fineline', 'Minimalista', 'Dotwork', 'Micro Tatuajes']
    },
    {
      name: 'DANIEL',
      specialty: 'Chicano & Lettering',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
      instagram: 'https://instagram.com',
      instagramHandle: '@daniel_letters',
      bio: 'Maestro del lettering y el estilo chicano. Daniel domina el arte de las letras, desde scripts elegantes hasta letras góticas, además de los icónicos diseños de la cultura chicana.',
      experience: '9 años',
      styles: ['Chicano', 'Lettering', 'Script', 'Black & Grey']
    },
    {
      name: 'LUIS',
      specialty: 'Trash Polka & Abstracto',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face',
      instagram: 'https://instagram.com',
      instagramHandle: '@luis_ink',
      bio: 'Pionero del estilo Trash Polka en Guatemala. Luis combina el caos controlado con elementos realistas y abstractos para crear piezas impactantes que desafían las convenciones.',
      experience: '6 años',
      styles: ['Trash Polka', 'Abstracto', 'Collage', 'Experimental']
    },
    {
      name: 'EMMANUEL CRUZ',
      specialty: 'Acuarela & Sketch',
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop&crop=face',
      instagram: 'https://instagram.com',
      instagramHandle: '@memmink',
      bio: 'Artista versátil especializado en el estilo acuarela y sketch. Emmanuel captura la esencia del arte libre y fluido, creando tatuajes que parecen pinturas en movimiento sobre la piel.',
      experience: '5 años',
      styles: ['Acuarela', 'Sketch', 'Ilustrativo', 'Watercolor']
    }
  ];

  // Works/Gallery data - 12 tattoos
  works: Work[] = [
    { id: 1, image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop', style: 'Realismo', artist: 'Juanpa Carcamo' },
    { id: 2, image: 'https://images.unsplash.com/photo-1590246814883-57c511a64404?w=400&h=400&fit=crop', style: 'Blackwork', artist: 'Abraham' },
    { id: 3, image: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=400&h=400&fit=crop', style: 'Neotradicional', artist: 'Kevin' },
    { id: 4, image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=400&fit=crop', style: 'Japonés', artist: 'Iñaki' },
    { id: 5, image: 'https://images.unsplash.com/photo-1612459284970-e8f027596582?w=400&h=400&fit=crop', style: 'Fineline', artist: 'Alexa' },
    { id: 6, image: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&h=400&fit=crop', style: 'Chicano', artist: 'Daniel' },
    { id: 7, image: 'https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?w=400&h=400&fit=crop', style: 'Trash Polka', artist: 'Luis' },
    { id: 8, image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop', style: 'Acuarela', artist: 'Emmanuel Cruz' },
    { id: 9, image: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&h=400&fit=crop', style: 'Geométrico', artist: 'Abraham' },
    { id: 10, image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=400&fit=crop', style: 'Dotwork', artist: 'Alexa' },
    { id: 11, image: 'https://images.unsplash.com/photo-1569407228235-9a744831a561?w=400&h=400&fit=crop', style: 'Sketch', artist: 'Emmanuel Cruz' },
    { id: 12, image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop', style: 'Lettering', artist: 'Daniel' }
  ];

  ngOnInit(): void {
    this.initScrollReveal();
    this.initSmoothScroll();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 100;
    this.checkReveal();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  // Artist Profile Modal Functions
  openArtistProfile(artist: Artist): void {
    this.selectedArtist = artist;
    // Filter works by artist name (handling uppercase/lowercase and partial matches)
    const artistFirstName = artist.name.split(' ')[0].toLowerCase();
    this.artistWorks = this.works.filter(work => 
      work.artist.toLowerCase().includes(artistFirstName) || 
      artist.name.toLowerCase().includes(work.artist.toLowerCase())
    );
    document.body.style.overflow = 'hidden';
  }

  closeArtistProfile(): void {
    this.selectedArtist = null;
    this.artistWorks = [];
    document.body.style.overflow = '';
  }

  // Close modal on escape key
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.selectedArtist) {
      this.closeArtistProfile();
    }
  }

  private initScrollReveal(): void {
    setTimeout(() => this.checkReveal(), 100);
  }

  private checkReveal(): void {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  }

  private initSmoothScroll(): void {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }
}