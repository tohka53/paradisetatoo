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
  showInGallery: boolean;  // Mostrar en galería principal
  showInProfile: boolean;  // Mostrar en perfil del artista
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
      image: '/juanpa/juanpa.jpeg',
      bioEs: '',
      bioEn: '',
      experience: '8 años',
      styles: ['Realismo', 'Retratos', 'Black & Grey', 'Color Realismo']
    },
        {
      name: 'ABRAHAM LEMUS',
      specialty: 'Oriental Ilustrativo',
      image: '/abhram/abhram.png',
      experience: '8 años', // Ajusta según corresponda
      bioEs: 'Abraham Lemus es un artista del tatuaje multidisciplinario radicado en Antigua Guatemala. Su trabajo se basa en un estilo Oriental Ilustrativo, donde la profundidad simbólica del arte tradicional japonés se fusiona con un lenguaje visual moderno, audaz y expresivo. Influenciado por el mundo del cartoon y el anime, sus tatuajes destacan por líneas limpias y sólidas, composiciones fuertes y una energía vibrante. Cada pieza combina la elegancia atemporal del irezumi con un enfoque contemporáneo pensado para envejecer bien en la piel. Si buscas un tatuaje oriental con significado, impacto y calidad duradera, Abraham es el artista que estás buscando.',
      bioEn: 'Abraham Lemus is a multidisciplinary tattoo artist based in Antigua, Guatemala. His work is rooted in an Illustrative Oriental style, where the symbolic depth of traditional Japanese art merges with a modern, bold, and expressive visual language. Influenced by the world of cartoons and anime, his tattoos stand out for their clean, solid linework, strong compositions, and vibrant energy. Each piece combines the timeless elegance of irezumi with a contemporary approach designed to age well on the skin. If you are looking for an oriental tattoo with meaning, impact, and long-lasting quality, Abraham is the artist you are looking for.',
      styles: ['Oriental', 'Irezumi', 'Ilustrativo', 'Cartoon/Anime']
    },
   {
  name: 'KEVIN',
  specialty: 'Fineline & Micro Realism',
  image: '/kevin/kevin.JPG',
  experience: '6 years',
  bioEs: 'Originario de Los Ángeles, California, y ahora radicado en Antigua, Guatemala. Llevo seis años tatuando. Mi trabajo se enfoca en línea fina, anime y micro realismo en blanco y negro. Disfruto trabajar tanto en piezas pequeñas como a gran escala, y siempre busco crear tatuajes que saquen lo mejor de cada idea. Valoro mucho a los clientes que confían en mi proceso creativo, sabiendo que su visión siempre es parte del diseño. ¡Espero conocerte pronto!',
  bioEn: 'I\'m originally from Los Angeles, California, and now based in Antigua, Guatemala. I\'ve been tattooing for six years. My work focuses on fine line, anime, and black & grey micro realism. I enjoy working on both small and large-scale pieces and always aim to create tattoos that bring out the best in each idea. I really value clients who trust my creative process while knowing their vision is always part of the design. Hope to meet you soon!',
  styles: ['Fineline', 'Anime', 'Micro Realism', 'Black & Grey']
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
      name: 'BRANDON',
      specialty: 'Tradicional & Linea Fina',
      image: '/brandon/brandon.png',
      bioEs: '',
      bioEn: '',
      experience: '+14 años',
      styles: ['Tradicional', 'Linea Fina', 'Black & Grey', 'Color']
    },
        {
        name: 'ALEXA',
        specialty: 'Fineline & Minimalista',
        image: '/made/madealexa.png',
        experience: '5 años', // 👈 Agregar esta línea
        bioEs: 'Mi nombre es Alexa y soy tatuadora Guatemalteca. Desde hace 5 años estoy desarrollando mi técnica en línea fina, creando diseños ilustrativos y botánicos. Mi objetivo es crear diseños únicos y personalizados, que se integren de manera armónica con tu cuerpo, fluyendo naturalmente con sus formas y movimientos. Busco que cada tatuaje no solo sea estéticamente bello, sino una pieza que ames y quieras llevar contigo siempre.',
        bioEn: 'My name is Alexa and I am a Guatemalan tattoo artist. For the past 5 years, Ive been developing my fine line technique, creating illustrative and botanical designs. My goal is to create unique and personalized designs that integrate harmoniously with your body, flowing naturally with its shapes and movements. I strive for each tattoo to be not only aesthetically beautiful, but also a piece you love and want to carry with you always.',
        styles: ['Fineline', 'Minimalista', 'Dotwork', 'Micro Tatuajes']
      },
    {
      name: 'DANIEL',
      specialty: 'Chicano & Lettering',
      image: '/daniel/daniel.png',
      bioEs: '',
      bioEn: '',
      experience: '9 años',
      styles: ['Chicano', 'Lettering', 'Script', 'Black & Grey']
    },
   {
  name: 'LUIS',
  specialty: 'Blackwork Ilustrativo',
  image: '/luis/luis.png',
  experience: '3 años',
  bioEs: 'Con 3 años de experiencia en el mundo del tattoo, mi estilo se ha inclinado por una tendencia blackwork, enfatizando en blackwork ilustrativo y ornamentos filosos. No obstante, también disfruto de estilos como el Fineline y black and grey. Hablando de arte en general, tengo obras en pintura al óleo, acrílico y acuarela, así como dibujos con carboncillo, grafito, crayones de colores y tinta usando rapidógrafos. Cuento con 3 años de arquitectura y 2 semestres de diseño gráfico, ambos en la Universidad de San Carlos de Guatemala.',
  bioEn: 'With 3 years of experience in the tattoo world, my style has leaned towards blackwork, emphasizing illustrative blackwork and sharp ornamental designs. However, I also enjoy styles such as fineline and black and grey. Speaking of art in general, I have works in oil painting, acrylic and watercolor, as well as drawings with charcoal, graphite, colored pencils and ink using technical pens. I have 3 years of architecture and 2 semesters of graphic design, both at the University of San Carlos de Guatemala.',
  styles: ['Blackwork', 'Ilustrativo', 'Ornamental', 'Fineline', 'Black & Grey']
},
    {
  name: 'MEMMINK',
  specialty: 'Realism & Sub Realism',
  image: '/memmink/memmink.png',
  experience: '10+ years',
  bioEs: 'Artista internacional del tatuaje y fundador de Paradise Tattoo Antigua Guatemala y Black Ocean ubicado en El Salvador. Con más de 10 años de experiencia en el mundo artístico del tatuaje. Nacido en El Salvador y radicado en Guatemala. Me especializo en realismo y sub realismo. También disfruto crear tatuajes orientales. Mi trabajo se caracteriza por llevar el detalle al máximo y trabajar múltiples sesiones para garantizar un acabado perfecto y óptimo en cada pieza, para que puedas llevar una obra de arte de por vida. Me describo como una persona conversadora, disfruto de una buena charla durante una sesión. Agradezco a todos mis clientes por confiar en mi trabajo.',
  bioEn: 'International tattoo artist and founder of Paradise Tattoo Antigua Guatemala and Black Ocean located in El Salvador. With more than 10 years of experience in the artistic world of tattooing. Born in El Salvador and Guatemalan based. I specialized in realism and sub realism. I also enjoy creating oriental tattoos. My work is characterized by taking detail to the maximum and working multiple sessions to guarantee a perfect and optimal finish in each piece so that you can carry a work of art for life. I describe myself as a talkative person, I enjoy a good talk during a session. I thank all my clients for trusting my work.',
  styles: ['Realism', 'Sub Realism', 'Oriental', 'Multi-Session Work']
}
  ];

  // Works/Gallery data - con control de dónde mostrar cada trabajo
  // showInGallery: true = aparece en la galería principal
  // showInProfile: true = aparece en el perfil del artista
  works: Work[] = [
    // === TRABAJOS EN AMBOS LUGARES (Galería + Perfil) ===
    { id: 4, image: '/fotos/inaki1.JPG', style: 'Tradicional', artist: 'Iñaki', showInGallery: true, showInProfile: true },
    
    // === TRABAJOS SOLO EN GALERÍA PRINCIPAL ===
    { id: 5, image: '/fotos/inaki2.JPG', style: 'Linea Fina', artist: 'Iñaki', showInGallery: true, showInProfile: false },
    
    // === TRABAJOS SOLO EN PERFIL DEL ARTISTA ===
    { id: 9, image: '/made/1.jpeg', style: '', artist: 'Alexa', showInGallery: false, showInProfile: true },
    { id: 10, image: '/made/2.jpeg', style: '', artist: 'Alexa', showInGallery: false, showInProfile: true },
    { id: 11, image: '/made/3.jpeg', style: '', artist: 'Alexa', showInGallery: false, showInProfile: true },
    { id: 12, image: '/made/4.jpeg', style: '', artist: 'Alexa', showInGallery: true, showInProfile: true },
    { id: 13, image: '/made/5.jpeg', style: '', artist: 'Alexa', showInGallery: false, showInProfile: true },
    { id: 14, image: '/made/6.jpeg', style: '', artist: 'Alexa', showInGallery: true, showInProfile: true },


     { id: 15, image: '/abhram/1.jpeg', style: '', artist: 'ABRAHAM LEMUS', showInGallery: false, showInProfile: true },
    { id: 16, image: '/abhram/2.jpeg', style: '', artist: 'ABRAHAM LEMUS', showInGallery: false, showInProfile: true },
    { id: 17, image: '/abhram/3.png', style: '', artist: 'ABRAHAM LEMUS', showInGallery: true, showInProfile: true },
    { id: 18, image: '/abhram/4.jpeg', style: '', artist: 'ABRAHAM LEMUS', showInGallery: false, showInProfile: true },
    { id: 19, image: '/abhram/5.jpeg', style: '', artist: 'ABRAHAM LEMUS', showInGallery: true, showInProfile: true },
  
  
   { id: 20, image: '/luis/1.jpg', style: '', artist: 'LUIS', showInGallery: false, showInProfile: true },
    { id: 21, image: '/luis/2.jpg', style: '', artist: 'LUIS', showInGallery: true, showInProfile: true },
    { id: 22, image: '/luis/3.jpg', style: '', artist: 'LUIS', showInGallery: false, showInProfile: true },
    { id: 23, image: '/luis/4.jpg', style: '', artist: 'LUIS', showInGallery: true, showInProfile: true },
    { id: 24, image: '/luis/5.jpg', style: '', artist: 'LUIS', showInGallery: false, showInProfile: true },
    { id: 25, image: '/luis/6.jpg', style: '', artist: 'LUIS', showInGallery: false, showInProfile: true },

   { id: 26, image: '/daniel/1.jpg', style: '', artist: 'DANIEL', showInGallery: true, showInProfile: true },
    { id: 27, image: '/daniel/2.jpg', style: '', artist: 'DANIEL', showInGallery: false, showInProfile: true },
    { id: 28, image: '/daniel/3.jpg', style: '', artist: 'DANIEL', showInGallery: false, showInProfile: true },
    { id: 29, image: '/daniel/4.jpg', style: '', artist: 'DANIEL', showInGallery: true, showInProfile: true },
    { id: 30, image: '/daniel/5.jpg', style: '', artist: 'DANIEL', showInGallery: false, showInProfile: true },
    { id: 31, image: '/daniel/6.jpeg', style: '', artist: 'DANIEL', showInGallery: false, showInProfile: true },
  

    { id: 26, image: '/memmink/1.JPG', style: '', artist: 'MEMMINK', showInGallery: false, showInProfile: true },
    { id: 27, image: '/memmink/2.JPG', style: '', artist: 'MEMMINK', showInGallery: true, showInProfile: true },
    { id: 28, image: '/memmink/3.JPEG', style: '', artist: 'MEMMINK', showInGallery: false, showInProfile: true },
    { id: 29, image: '/memmink/4.JPEG', style: '', artist: 'MEMMINK', showInGallery: true, showInProfile: true },
    { id: 30, image: '/memmink/5.JPEG', style: '', artist: 'MEMMINK', showInGallery: false, showInProfile: true },
    { id: 31, image: '/memmink/6.JPEG', style: '', artist: 'MEMMINK', showInGallery: true, showInProfile: true },
  


    { id: 32, image: '/kevin/1.jpeg', style: '', artist: 'KEVIN', showInGallery: false, showInProfile: true },
    { id: 33, image: '/kevin/2.jpeg', style: '', artist: 'KEVIN', showInGallery: true, showInProfile: true },
    { id: 34, image: '/kevin/3.jpeg', style: '', artist: 'KEVIN', showInGallery: false, showInProfile: true },
    { id: 35, image: '/kevin/4.jpeg', style: '', artist: 'KEVIN', showInGallery: true, showInProfile: true },
    { id: 36, image: '/kevin/5.jpeg', style: '', artist: 'KEVIN', showInGallery: false, showInProfile: true },
    { id: 37, image: '/kevin/6.jpeg', style: '', artist: 'KEVIN', showInGallery: false, showInProfile: true },
  

     { id: 38, image: '/juanpa/1.jpeg', style: '', artist: 'JUANPA', showInGallery: true, showInProfile: true },
    { id: 39, image: '/juanpa/2.jpeg', style: '', artist: 'JUANPA', showInGallery: true, showInProfile: true },
  

     { id: 40, image: '/brandon/1.JPG', style: '', artist: 'BRANDON', showInGallery: false, showInProfile: true },
    { id: 41, image: '/brandon/2.JPG', style: '', artist: 'BRANDON', showInGallery: true, showInProfile: true },
    { id: 42, image: '/brandon/3.jpg', style: '', artist: 'BRANDON', showInGallery: false, showInProfile: true },
    { id: 43, image: '/brandon/4.jpg', style: '', artist: 'BRANDON', showInGallery: true, showInProfile: true },
    { id: 44, image: '/brandon/5.jpg', style: '', artist: 'BRANDON', showInGallery: true, showInProfile: true },
    { id: 45, image: '/brandon/6.jpg', style: '', artist: 'BRANDON', showInGallery: false, showInProfile: true },
  
  ];

  // Getter para trabajos de la galería principal
  get galleryWorks(): Work[] {
    return this.works.filter(work => work.showInGallery);
  }

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
    // Filter works by artist name AND showInProfile = true
    const artistFirstName = artist.name.split(' ')[0].toLowerCase();
    this.artistWorks = this.works.filter(work => 
      work.showInProfile && (
        work.artist.toLowerCase().includes(artistFirstName) || 
        artist.name.toLowerCase().includes(work.artist.toLowerCase())
      )
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