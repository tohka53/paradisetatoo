import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';

/* ╔══════════════════════════════════════════════════════════════╗
   ║  PARADISE TATTOO - ULTRA MODERN 2025                        ║
   ║  Compatible con NgModule (standalone: false)                ║
   ╚══════════════════════════════════════════════════════════════╝ */

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
  showInGallery: boolean;
  showInProfile: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  currentYear = new Date().getFullYear();
  scrolled = false;
  mobileMenuOpen = false;
  currentLang: 'es' | 'en' = 'es';
  
  selectedArtist: Artist | null = null;
  artistWorks: Work[] = [];

  private spanishLanguageCodes = [
    'es', 'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-CL', 'es-VE', 'es-PE', 
    'es-EC', 'es-GT', 'es-CU', 'es-BO', 'es-DO', 'es-HN', 'es-PY', 
    'es-SV', 'es-NI', 'es-CR', 'es-PA', 'es-UY'
  ];

  // ==================== TRANSLATIONS ====================
  translations: { [key: string]: { es: string; en: string } } = {
    'nav.home': { es: 'INICIO', en: 'HOME' },
    'nav.artists': { es: 'ARTISTAS', en: 'ARTISTS' },
    'nav.works': { es: 'TRABAJOS', en: 'WORK' },
    'nav.location': { es: 'UBICACIÓN', en: 'LOCATION' },
    'nav.contact': { es: 'CONTÁCTANOS', en: 'CONTACT US' },
    'hero.badge': { es: 'ESTUDIO DE TATUAJES EN ANTIGUA GUATEMALA', en: 'TATTOO STUDIO IN ANTIGUA GUATEMALA' },
    'hero.tagline': { es: 'Arte que trasciende en tu piel', en: 'Art that transcends on your skin' },
    'hero.cta': { es: 'AGENDA TU CITA', en: 'BOOK YOUR APPOINTMENT' },
    'hero.cta2': { es: 'VER TRABAJOS', en: 'VIEW WORK' },
    'hero.scroll': { es: 'SCROLL', en: 'SCROLL' },
    'artists.label': { es: 'NUESTRO EQUIPO', en: 'OUR TEAM' },
    'artists.title': { es: 'ARTISTAS', en: 'ARTISTS' },
    'artists.subtitle': { es: 'Cada artista con su propio estilo único', en: 'Each artist with their own unique style' },
    'artists.viewProfile': { es: 'VER PERFIL', en: 'VIEW PROFILE' },
    'gallery.label': { es: 'PORTAFOLIO', en: 'PORTFOLIO' },
    'gallery.title': { es: 'TRABAJOS', en: 'WORK' },
    'gallery.subtitle': { es: 'Explora nuestro portafolio', en: 'Explore our portfolio' },
    'gallery.viewMore': { es: 'VER MÁS EN INSTAGRAM', en: 'VIEW MORE ON INSTAGRAM' },
    'location.title': { es: 'UBICACIÓN', en: 'LOCATION' },
    'location.address': { es: 'DIRECCIÓN', en: 'ADDRESS' },
    'location.hours': { es: 'HORARIO', en: 'HOURS' },
    'location.contact': { es: 'CONTACTO', en: 'CONTACT' },
    'location.whatsapp': { es: 'ENVIAR WHATSAPP', en: 'SEND WHATSAPP' },
    'location.addressText': { 
      es: '5ta Avenida Norte #25<br>La Antigua Guatemala<br>Sacatepéquez, Guatemala',
      en: '5ta Avenida Norte #25<br>Antigua Guatemala<br>Sacatepéquez, Guatemala'
    },
    'location.hoursText': { 
      es: 'Lunes - Sábado: 10:00 AM - 8:00 PM<br>Domingo: 11:00 AM - 6:00 PM',
      en: 'Monday - Saturday: 10:00 AM - 8:00 PM<br>Sunday: 11:00 AM - 6:00 PM'
    },
    'contact.label': { es: 'ESCRÍBENOS', en: 'WRITE US' },
    'contact.title': { es: 'CONTACTO', en: 'CONTACT' },
    'contact.subtitle': { es: 'Cuéntanos sobre tu próximo tatuaje', en: 'Tell us about your next tattoo' },
    'contact.name': { es: 'NOMBRE', en: 'NAME' },
    'contact.email': { es: 'EMAIL', en: 'EMAIL' },
    'contact.phone': { es: 'TELÉFONO / WHATSAPP', en: 'PHONE / WHATSAPP' },
    'contact.design': { es: 'DESCRIBE TU IDEA', en: 'DESCRIBE YOUR IDEA' },
    'contact.designPlaceholder': { es: 'Estilo, tamaño, ubicación en el cuerpo...', en: 'Style, size, body placement...' },
    'contact.artist': { es: 'ARTISTA DE PREFERENCIA', en: 'PREFERRED ARTIST' },
    'contact.artistNone': { es: 'Sin preferencia', en: 'No preference' },
    'contact.submit': { es: 'ENVIAR CONSULTA', en: 'SEND INQUIRY' },
    'footer.follow': { es: 'SÍGUENOS', en: 'FOLLOW US' },
    'footer.contactInfo': { es: 'CONTACTO', en: 'CONTACT' },
    'footer.rights': { es: 'Paradise Tattoo. Antigua Guatemala.', en: 'Paradise Tattoo. Antigua Guatemala.' },
    'modal.experience': { es: 'Experiencia', en: 'Experience' },
    'modal.works': { es: 'Trabajos', en: 'Works' },
    'modal.styles': { es: 'Estilos', en: 'Styles' },
    'modal.about': { es: 'SOBRE EL ARTISTA', en: 'ABOUT THE ARTIST' },
    'modal.stylesTitle': { es: 'ESTILOS', en: 'STYLES' },
    'modal.worksTitle': { es: 'TRABAJOS REALIZADOS', en: 'COMPLETED WORK' },
    'modal.bookWith': { es: 'AGENDAR CON', en: 'BOOK WITH' },
    'modal.viewInstagram': { es: 'VER INSTAGRAM', en: 'VIEW INSTAGRAM' }
  };

  // ==================== ARTISTS DATA ====================
  artists: Artist[] = [
    {
      name: 'MEMMINK',
      specialty: 'Realism & Sub Realism',
      image: '/memmink/memmink.png',
      experience: '10+ años',
      bioEs: 'Artista internacional del tatuaje y fundador de Paradise Tattoo Antigua Guatemala y Black Ocean ubicado en El Salvador. Con más de 10 años de experiencia en el mundo artístico del tatuaje.',
      bioEn: 'International tattoo artist and founder of Paradise Tattoo Antigua Guatemala and Black Ocean located in El Salvador. With more than 10 years of experience in tattooing.',
      styles: ['Realism', 'Sub Realism', 'Oriental', 'Multi-Session Work']
    },
    {
      name: 'IÑAKI',
      specialty: 'Tradicional & Línea Fina',
      image: '/fotos/inaki0.JPG',
      bioEs: 'Guatemalteco, con más de 14 años de experiencia en el arte del tatuaje.',
      bioEn: 'Guatemalan tattoo artist with over 14 years of experience.',
      experience: '+14 años',
      styles: ['Traditional', 'Fine Line', 'Black & Grey', 'Color']
    },
    {
      name: 'ABRAHAM LEMUS',
      specialty: 'Oriental Ilustrativo',
      image: '/abhram/abhram.png',
      experience: '8 años',
      bioEs: 'Abraham Lemus es un artista del tatuaje multidisciplinario radicado en Antigua Guatemala.',
      bioEn: 'Abraham Lemus is a multidisciplinary tattoo artist based in Antigua, Guatemala.',
      styles: ['Oriental', 'Irezumi', 'Illustrative', 'Cartoon/Anime']
    },
    {
      name: 'JUANPA CARCAMO',
      specialty: 'Realismo & Retratos',
      image: '/juanpa/juanpa.jpeg',
      bioEs: 'Especialista en realismo y retratos.',
      bioEn: 'Specialist in realism and portraits.',
      experience: '8 años',
      styles: ['Realism', 'Portraits', 'Black & Grey', 'Color Realism']
    },
    {
      name: 'KEVIN',
      specialty: 'Fineline & Micro Realism',
      image: '/kevin/kevin.JPG',
      experience: '6 años',
      bioEs: 'Originario de Los Ángeles, California, ahora radicado en Antigua, Guatemala.',
      bioEn: 'Originally from Los Angeles, California, now based in Antigua, Guatemala.',
      styles: ['Fineline', 'Anime', 'Micro Realism', 'Black & Grey']
    },
    {
      name: 'BRANDON',
      specialty: 'Tradicional & Línea Fina',
      image: '/brandon/brandon.png',
      bioEs: 'Especializado en tatuajes tradicionales y línea fina.',
      bioEn: 'Specialized in traditional tattoos and fine line work.',
      experience: '+14 años',
      styles: ['Traditional', 'Fine Line', 'Black & Grey', 'Color']
    },
    {
      name: 'ALEXA',
      specialty: 'Fineline & Minimalista',
      image: '/made/madealexa.png',
      experience: '5 años',
      bioEs: 'Tatuadora Guatemalteca especializada en línea fina y diseños botánicos.',
      bioEn: 'Guatemalan tattoo artist specialized in fine line and botanical designs.',
      styles: ['Fineline', 'Minimalist', 'Dotwork', 'Botanical']
    },
    {
      name: 'DANIEL',
      specialty: 'Traditional Tattoo',
      image: '/daniel/daniel.png',
      experience: '6 años',
      bioEs: 'Estilo enfocado en el tatuaje tradicional clásico.',
      bioEn: 'Style focused on classic traditional tattooing.',
      styles: ['Traditional', 'Dotwork', 'Bold Lines']
    },
    {
      name: 'LUIS',
      specialty: 'Blackwork Ilustrativo',
      image: '/luis/luis.png',
      experience: '3 años',
      bioEs: 'Especializado en blackwork ilustrativo y ornamentos.',
      bioEn: 'Specialized in illustrative blackwork and ornamental designs.',
      styles: ['Blackwork', 'Illustrative', 'Ornamental', 'Fineline']
    }
  ];

  // ==================== WORKS DATA ====================
  works: Work[] = [
    { id: 4, image: '/fotos/inaki1.JPG', style: 'Traditional', artist: 'Iñaki', showInGallery: true, showInProfile: true },
    { id: 5, image: '/fotos/inaki2.JPG', style: 'Fine Line', artist: 'Iñaki', showInGallery: true, showInProfile: false },
    { id: 12, image: '/made/4.jpeg', style: '', artist: 'Alexa', showInGallery: true, showInProfile: true },
    { id: 14, image: '/made/6.jpeg', style: '', artist: 'Alexa', showInGallery: true, showInProfile: true },
    { id: 17, image: '/abhram/3.png', style: '', artist: 'ABRAHAM LEMUS', showInGallery: true, showInProfile: true },
    { id: 19, image: '/abhram/5.jpeg', style: '', artist: 'ABRAHAM LEMUS', showInGallery: true, showInProfile: true },
    { id: 21, image: '/luis/2.jpg', style: '', artist: 'LUIS', showInGallery: true, showInProfile: true },
    { id: 23, image: '/luis/4.jpg', style: '', artist: 'LUIS', showInGallery: true, showInProfile: true },
    { id: 26, image: '/daniel/1.jpg', style: '', artist: 'DANIEL', showInGallery: true, showInProfile: true },
    { id: 29, image: '/daniel/4.jpg', style: '', artist: 'DANIEL', showInGallery: true, showInProfile: true },
    { id: 33, image: '/memmink/2.JPG', style: '', artist: 'MEMMINK', showInGallery: true, showInProfile: true },
    { id: 35, image: '/memmink/4.JPEG', style: '', artist: 'MEMMINK', showInGallery: true, showInProfile: true },
    { id: 37, image: '/memmink/6.JPEG', style: '', artist: 'MEMMINK', showInGallery: true, showInProfile: true },
    { id: 39, image: '/kevin/2.jpeg', style: '', artist: 'KEVIN', showInGallery: true, showInProfile: true },
    { id: 41, image: '/kevin/4.jpeg', style: '', artist: 'KEVIN', showInGallery: true, showInProfile: true },
    { id: 44, image: '/juanpa/1.jpeg', style: '', artist: 'JUANPA', showInGallery: true, showInProfile: true },
    { id: 45, image: '/juanpa/2.jpeg', style: '', artist: 'JUANPA', showInGallery: true, showInProfile: true },
    { id: 47, image: '/brandon/2.JPG', style: '', artist: 'BRANDON', showInGallery: true, showInProfile: true },
    { id: 49, image: '/brandon/4.jpg', style: '', artist: 'BRANDON', showInGallery: true, showInProfile: true },
    { id: 50, image: '/brandon/5.jpg', style: '', artist: 'BRANDON', showInGallery: true, showInProfile: true }
  ];

  constructor() {}

  get galleryWorks(): Work[] {
    return this.works.filter(work => work.showInGallery);
  }

  ngOnInit(): void {
    this.detectLanguage();
    setTimeout(() => this.checkReveal(), 100);
  }

  detectLanguage(): void {
    const browserLang = navigator.language || 'en';
    this.currentLang = this.spanishLanguageCodes.some(
      code => browserLang.toLowerCase().startsWith(code.toLowerCase())
    ) ? 'es' : 'en';
  }

  t(key: string): string {
    return this.translations[key]?.[this.currentLang] || key;
  }

  getArtistBio(): string {
    if (!this.selectedArtist) return '';
    return this.currentLang === 'es' ? this.selectedArtist.bioEs : this.selectedArtist.bioEn;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 80;
    this.checkReveal();
  }

  private checkReveal(): void {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 120) {
        el.classList.add('active');
      }
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  openArtistProfile(artist: Artist): void {
    this.selectedArtist = artist;
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

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.selectedArtist) this.closeArtistProfile();
    if (this.mobileMenuOpen) this.toggleMobileMenu();
  }
}