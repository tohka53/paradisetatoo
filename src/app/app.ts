import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

interface Artist {
  name: string;
  specialty: string;
  image: string;
  bioEs: string;
  bioEn: string;
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
      bioEs: 'Especialista en realismo con más de 8 años de experiencia. Su pasión por el detalle y la precisión lo han convertido en uno de los artistas más solicitados para retratos y piezas hiperrealistas.',
      bioEn: 'Realism specialist with over 8 years of experience. His passion for detail and precision has made him one of the most sought-after artists for portraits and hyperrealistic pieces.',
      experience: '8 años',
      styles: ['Realismo', 'Retratos', 'Black & Grey', 'Color Realismo']
    },
    {
      name: 'ABRAHAM',
      specialty: 'Blackwork & Geométrico',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
      bioEs: 'Maestro del blackwork y los diseños geométricos. Abraham combina patrones ancestrales con técnicas modernas para crear piezas únicas que destacan por su precisión y simetría perfecta.',
      bioEn: 'Master of blackwork and geometric designs. Abraham combines ancestral patterns with modern techniques to create unique pieces that stand out for their precision and perfect symmetry.',
      experience: '6 años',
      styles: ['Blackwork', 'Geométrico', 'Tribal', 'Mandala']
    },
    {
      name: 'KEVIN',
      specialty: 'Neotradicional & Color',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
      bioEs: 'Apasionado por el color vibrante y las líneas audaces del estilo neotradicional. Kevin transforma ideas clásicas en obras de arte contemporáneas llenas de vida y movimiento.',
      bioEn: 'Passionate about vibrant color and bold lines of the neo-traditional style. Kevin transforms classic ideas into contemporary works of art full of life and movement.',
      experience: '5 años',
      styles: ['Neotradicional', 'Color', 'Old School', 'Ilustrativo']
    },
    {
      name: 'IÑAKI',
      specialty: 'Tradicional & Linea Fina',
      image: '/fotos/inaki0.JPG',
      bioEs: 'Guatemalteco, con más de 14 años de experiencia en el arte del tatuaje, me especializo en el estilo tradicional, trabajando desde líneas finas y precisas hasta trazos más gruesos y sólidos que resisten el paso del tiempo. Mi enfoque se centra en crear diseños únicos que se adapten de forma orgánica al cuerpo, cuidando cada detalle para que el tatuaje evolucione naturalmente con los años. Mi proceso siempre comienza escuchando al cliente: entender qué busca, qué quiere transmitir y cómo llevar esa idea a la piel de la mejor manera posible. Creo firmemente que un buen tatuaje combina técnica, creatividad y respeto por la persona que lo llevará toda la vida. Por eso, en cada sesión pongo toda mi atención en los detalles, en la calidad del trazo y en lograr un resultado que envejezca con belleza. Trabajo tanto en negro y gris como en color, y realizo diseños personalizados y piezas de "flash", siempre buscando mantener un equilibrio entre tradición, durabilidad y expresión personal.',
      bioEn: 'Guatemalan tattoo artist with over 14 years of experience in the craft, I specialize in traditional style tattoos — from fine, precise lines to bold, solid strokes that stand the test of time. My focus is on creating unique designs that flow naturally with the body, paying close attention to every detail so that each tattoo ages gracefully over the years. My process always begins by listening to the client — understanding what they\'re looking for, what they want to express, and how to best bring that idea to life on the skin. I truly believe that a great tattoo is built on technique, creativity, and respect for the person who will wear it forever. That\'s why, in every session, I dedicate my full attention to detail, line quality, and achieving a result that remains beautiful over time. I work in both black/grey, as well as color, offering custom designs and flash pieces — always striving to balance tradition, longevity, and personal expression.',
      experience: '+14 años',
      styles: ['Tradicional', 'Linea Fina', 'Black & Grey', 'Color']
    },
    {
      name: 'ALEXA',
      specialty: 'Fineline & Minimalista',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face',
      bioEs: 'Especialista en líneas finas y diseños minimalistas. Alexa cree que menos es más, y sus tatuajes delicados demuestran que la belleza está en la simplicidad y la elegancia.',
      bioEn: 'Specialist in fine lines and minimalist designs. Alexa believes that less is more, and her delicate tattoos demonstrate that beauty lies in simplicity and elegance.',
      experience: '4 años',
      styles: ['Fineline', 'Minimalista', 'Dotwork', 'Micro Tatuajes']
    },
    {
      name: 'DANIEL',
      specialty: 'Chicano & Lettering',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
      bioEs: 'Maestro del lettering y el estilo chicano. Daniel domina el arte de las letras, desde scripts elegantes hasta letras góticas, además de los icónicos diseños de la cultura chicana.',
      bioEn: 'Master of lettering and Chicano style. Daniel dominates the art of letters, from elegant scripts to gothic letters, as well as the iconic designs of Chicano culture.',
      experience: '9 años',
      styles: ['Chicano', 'Lettering', 'Script', 'Black & Grey']
    },
    {
      name: 'LUIS',
      specialty: 'Trash Polka & Abstracto',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face',
      bioEs: 'Pionero del estilo Trash Polka en Guatemala. Luis combina el caos controlado con elementos realistas y abstractos para crear piezas impactantes que desafían las convenciones.',
      bioEn: 'Pioneer of the Trash Polka style in Guatemala. Luis combines controlled chaos with realistic and abstract elements to create impactful pieces that challenge conventions.',
      experience: '6 años',
      styles: ['Trash Polka', 'Abstracto', 'Collage', 'Experimental']
    },
    {
      name: 'EMMANUEL CRUZ',
      specialty: 'Acuarela & Sketch',
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop&crop=face',
      bioEs: 'Artista versátil especializado en el estilo acuarela y sketch. Emmanuel captura la esencia del arte libre y fluido, creando tatuajes que parecen pinturas en movimiento sobre la piel.',
      bioEn: 'Versatile artist specialized in watercolor and sketch style. Emmanuel captures the essence of free and fluid art, creating tattoos that look like paintings in motion on the skin.',
      experience: '5 años',
      styles: ['Acuarela', 'Sketch', 'Ilustrativo', 'Watercolor']
    }
  ];

  // Works/Gallery data - 13 tattoos
  works: Work[] = [
    { id: 1, image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop', style: 'Realismo', artist: 'Juanpa Carcamo' },
    { id: 2, image: 'https://images.unsplash.com/photo-1590246814883-57c511a64404?w=400&h=400&fit=crop', style: 'Blackwork', artist: 'Abraham' },
    { id: 3, image: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=400&h=400&fit=crop', style: 'Neotradicional', artist: 'Kevin' },
    { id: 4, image: '/fotos/inaki1.JPG', style: 'Tradicional', artist: 'Iñaki' },
    { id: 5, image: '/fotos/inaki2.JPG', style: 'Linea Fina', artist: 'Iñaki' },
    { id: 6, image: 'https://images.unsplash.com/photo-1612459284970-e8f027596582?w=400&h=400&fit=crop', style: 'Fineline', artist: 'Alexa' },
    { id: 7, image: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&h=400&fit=crop', style: 'Chicano', artist: 'Daniel' },
    { id: 8, image: 'https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?w=400&h=400&fit=crop', style: 'Trash Polka', artist: 'Luis' },
    { id: 9, image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop', style: 'Acuarela', artist: 'Emmanuel Cruz' },
    { id: 10, image: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&h=400&fit=crop', style: 'Geométrico', artist: 'Abraham' },
    { id: 11, image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=400&fit=crop', style: 'Dotwork', artist: 'Alexa' },
    { id: 12, image: 'https://images.unsplash.com/photo-1569407228235-9a744831a561?w=400&h=400&fit=crop', style: 'Sketch', artist: 'Emmanuel Cruz' },
    { id: 13, image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=400&fit=crop', style: 'Lettering', artist: 'Daniel' }
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
          if (href) {
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }
}