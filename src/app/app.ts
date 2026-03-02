import { Component, OnInit, OnDestroy, HostListener, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { inject } from '@vercel/analytics';

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

interface FaqItem { q: string; a: string; open: boolean; }

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  currentYear = new Date().getFullYear();
  scrolled = false;
  mobileMenuOpen = false;
  currentLang: 'es' | 'en' = 'es';
  selectedArtist: Artist | null = null;
  artistWorks: Work[] = [];
  faqItems: FaqItem[] = [];
  viewerImage: string | null = null;
  private observer: IntersectionObserver | null = null;
  private scrollTicking = false;

  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('navLogoVideo') navLogoVideo!: ElementRef<HTMLVideoElement>;

  private spanishCodes = ['es','es-ES','es-MX','es-AR','es-CO','es-CL','es-VE','es-PE','es-EC','es-GT','es-CU','es-BO','es-DO','es-HN','es-PY','es-SV','es-NI','es-CR','es-PA','es-UY'];

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
    'artists.title': { es: 'ARTISTAS', en: 'ARTISTS' },
    'artists.subtitle': { es: 'Cada artista con su propio estilo único', en: 'Each artist with their own unique style' },
    'artists.viewProfile': { es: 'VER PERFIL', en: 'VIEW PROFILE' },
    'gallery.title': { es: 'TRABAJOS', en: 'WORK' },
    'gallery.subtitle': { es: 'Explora nuestro portafolio', en: 'Explore our portfolio' },
    'gallery.viewMore': { es: 'VER MÁS EN INSTAGRAM', en: 'VIEW MORE ON INSTAGRAM' },
    'location.title': { es: 'UBICACIÓN', en: 'LOCATION' },
    'location.address': { es: 'DIRECCIÓN', en: 'ADDRESS' },
    'location.hours': { es: 'HORARIO', en: 'HOURS' },
    'location.contact': { es: 'CONTACTO', en: 'CONTACT' },
    'location.whatsapp': { es: 'ENVIAR WHATSAPP', en: 'SEND WHATSAPP' },
    'location.addressText': { es: '9na Calle Poniente, Casa No. 9<br>La Antigua Guatemala<br>Sacatepéquez, Guatemala', en: '9na Calle Poniente, Casa No. 9<br>Antigua Guatemala<br>Sacatepéquez, Guatemala' },
    'location.hoursText': { es: 'Lunes - Sábado: 08:00 AM - 07:00 PM<br>Domingo: 10:00 AM - 06:00 PM', en: 'Monday - Saturday: 08:00 AM - 07:00 PM<br>Sunday: 10:00 AM - 06:00 PM' },
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
    'footer.nav': { es: 'NAVEGACIÓN', en: 'NAVIGATION' },
    'footer.contactInfo': { es: 'CONTACTO', en: 'CONTACT' },
    'footer.rights': { es: 'Paradise Tattoo. Antigua Guatemala.', en: 'Paradise Tattoo. Antigua Guatemala.' },
    'modal.experience': { es: 'Experiencia', en: 'Experience' },
    'modal.works': { es: 'Trabajos', en: 'Works' },
    'modal.styles': { es: 'Estilos', en: 'Styles' },
    'modal.about': { es: 'SOBRE EL ARTISTA', en: 'ABOUT THE ARTIST' },
    'modal.stylesTitle': { es: 'ESTILOS', en: 'STYLES' },
    'modal.worksTitle': { es: 'TRABAJOS REALIZADOS', en: 'COMPLETED WORK' },
    'modal.bookWith': { es: 'AGENDAR CON', en: 'BOOK WITH' },
    'modal.viewInstagram': { es: 'VER INSTAGRAM', en: 'VIEW INSTAGRAM' },
    'divider.space': { es: 'NUESTRO ESPACIO', en: 'OUR SPACE' },
    'divider.spaceDesc': { es: 'Un lugar único para el arte del tatuaje', en: 'A unique place for tattoo art' },
    'faq.subtitle': { es: 'Preguntas frecuentes', en: 'Frequently asked questions' }
  };

  private faqDataEs = [
    { q: '¿Cómo agendo una cita?', a: 'Puedes agendar contactándonos por WhatsApp al +502 5727 2087, por email o usando el formulario de contacto. Cuéntanos tu idea y te responderemos lo antes posible.' },
    { q: '¿Cuánto cuesta un tatuaje?', a: 'El precio varía según tamaño, complejidad, ubicación en el cuerpo y artista. Contáctanos con tu idea para una cotización personalizada.' },
    { q: '¿Qué edad mínima se necesita?', a: 'Debes tener al menos 18 años. Es necesario presentar identificación válida con fotografía.' },
    { q: '¿Cuánto tarda en sanar?', a: 'La cicatrización superficial toma 2-3 semanas, pero la regeneración completa tarda varios meses. Te daremos instrucciones detalladas de cuidado.' },
    { q: '¿Cómo debo prepararme?', a: 'Come bien antes de tu cita, mantente hidratado y evita el alcohol 24 horas antes. Llega descansado con ropa cómoda.' },
    { q: '¿Aceptan walk-ins?', a: 'Sí, según disponibilidad. Te recomendamos agendar con anticipación por WhatsApp o email.' },
    { q: '¿Qué formas de pago aceptan?', a: 'Efectivo (Quetzales y Dólares), transferencias bancarias y tarjetas de crédito/débito.' }
  ];
  private faqDataEn = [
    { q: 'How do I book an appointment?', a: 'Contact us via WhatsApp at +502 5727 2087, email, or the contact form. Tell us your idea and we will get back to you.' },
    { q: 'How much does a tattoo cost?', a: 'Pricing varies by size, complexity, placement, and artist. Contact us with your idea for a personalized quote.' },
    { q: 'What is the minimum age?', a: 'You must be at least 18 years old. A valid photo ID is required.' },
    { q: 'How long does healing take?', a: 'Surface healing takes 2-3 weeks; full regeneration takes several months. You will receive aftercare instructions.' },
    { q: 'How should I prepare?', a: 'Eat well, stay hydrated, avoid alcohol 24 hours before. Arrive rested wearing comfortable clothing.' },
    { q: 'Do you accept walk-ins?', a: 'Yes, based on availability. We recommend scheduling in advance via WhatsApp or email.' },
    { q: 'What payment methods do you accept?', a: 'Cash (Quetzales and USD), bank transfers, and credit/debit cards.' }
  ];

  artists: Artist[] = [
{ name: 'MEMINK', specialty: 'Realism & Sub Realism', image: '/memmink/memmink.png', experience: '10+ años', bioEs: 'Artista internacional del tatuaje y fundador de Paradise Tattoo Antigua Guatemala y Black Ocean ubicado en El Salvador. Con más de 10 años de experiencia en el mundo artístico del tatuaje. Nacido en El Salvador y establecido en Guatemala. Me especializo en realismo y sub realismo. También disfruto crear tatuajes orientales. Mi trabajo se caracteriza por llevar el detalle al máximo y trabajar múltiples sesiones para garantizar un acabado perfecto y óptimo en cada pieza, para que puedas llevar una obra de arte de por vida. Me describo como una persona conversadora, disfruto de una buena plática durante la sesión. Agradezco a todos mis clientes por confiar en mi trabajo.', bioEn: 'International tattoo artist and founder of Paradise Tattoo Antigua Guatemala and Black Ocean located in El Salvador. With more than 10 years of experience in the artistic world of tattooing. Born in El Salvador and Guatemalan based. I specialized in realism and sub realism. I also enjoy creating oriental tattoos. My work is characterized by taking detail to the maximum and working multiple sessions to guarantee a perfect and optimal finish in each piece so that you can carry a work of art for life. I describe myself as a talkative person, I enjoy a good talk during a session. I thank all my clients for trusting my work.', styles: ['Realism', 'Sub Realism', 'Oriental', 'Multi-Session Work'] },
{ name: 'IÑAKI', specialty: 'Tradicional & Línea Fina', image: '/fotos/inaki0.JPG', bioEs: 'Guatemalteco, con más de 14 años de experiencia en el arte del tatuaje, me especializo en el estilo tradicional, trabajando desde líneas finas y precisas hasta trazos más gruesos y sólidos que resisten el paso del tiempo. Mi enfoque se centra en crear diseños únicos que se adapten de forma orgánica al cuerpo, cuidando cada detalle para que el tatuaje evolucione naturalmente con los años. Mi proceso siempre comienza escuchando al cliente: entender qué busca, qué quiere transmitir y cómo llevar esa idea a la piel de la mejor manera posible. Creo firmemente que un buen tatuaje combina técnica, creatividad y respeto por la persona que lo llevará toda la vida. Por eso, en cada sesión pongo toda mi atención en los detalles, en la calidad del trazo y en lograr un resultado que envejezca con belleza. Trabajo tanto en negro y gris como en color, y realizo diseños personalizados y piezas de flash, siempre buscando mantener un equilibrio entre tradición, durabilidad y expresión personal.', bioEn: 'Guatemalan tattoo artist with over 14 years of experience in the craft, I specialize in traditional style tattoos — from fine, precise lines to bold, solid strokes that stand the test of time. My focus is on creating unique designs that flow naturally with the body, paying close attention to every detail so that each tattoo ages gracefully over the years. My process always begins by listening to the client — understanding what they\'re looking for, what they want to express, and how to best bring that idea to life on the skin. I truly believe that a great tattoo is built on technique, creativity, and respect for the person who will wear it forever. That\'s why, in every session, I dedicate my full attention to detail, line quality, and achieving a result that remains beautiful over time. I work in both black & grey as well as color, offering custom designs and flash pieces — always striving to balance tradition, longevity, and personal expression.', experience: '+14 años', styles: ['Traditional', 'Fine Line', 'Black & Grey', 'Color'] },
{ name: 'ABRAHAM LEMUS', specialty: 'Oriental Ilustrativo', image: '/abhram/abhram.png', experience: '8 años', bioEs: 'Abraham Lemus es un artista del tatuaje multidisciplinario radicado en Antigua Guatemala. Su trabajo se basa en un estilo Oriental Ilustrativo, donde la profundidad simbólica del arte tradicional japonés se fusiona con un lenguaje visual moderno, audaz y expresivo. Influenciado por el mundo del cartoon y el anime, sus tatuajes destacan por líneas limpias y sólidas, composiciones fuertes y una energía vibrante. Cada pieza combina la elegancia atemporal del irezumi con un enfoque contemporáneo pensado para envejecer bien en la piel. Si buscas un tatuaje oriental con significado, impacto y calidad duradera, Abraham es el artista que estás buscando.', bioEn: 'Abraham Lemus is a multidisciplinary tattoo artist based in Antigua, Guatemala. His work is rooted in an Illustrative Oriental style, where the symbolic depth of traditional Japanese art merges with a modern, bold, and expressive visual language. Influenced by the world of cartoons and anime, his tattoos stand out for their clean, solid linework, strong compositions, and vibrant energy. Each piece combines the timeless elegance of irezumi with a contemporary approach designed to age well on the skin.', styles: ['Oriental', 'Irezumi', 'Illustrative', 'Cartoon/Anime'] },
    { name: 'JUANPA CARCAMO', specialty: 'Realismo & Retratos', image: '/juanpa/juanpa.jpeg', bioEs: 'Especialista en realismo y retratos.', bioEn: 'Specialist in realism and portraits.', experience: '8 años', styles: ['Realism', 'Portraits', 'Black & Grey', 'Color Realism'] },
{ name: 'KEVIN', specialty: 'Fineline & Micro Realism', image: '/kevin/kevin.JPG', experience: '6 años', bioEs: 'Originario de Los Ángeles, California, ahora radicado en Antigua, Guatemala. Llevo seis años tatuando. Mi trabajo se enfoca en fineline, anime y micro realismo en negro y gris. Disfruto trabajar tanto en piezas pequeñas como en gran escala, y siempre busco crear tatuajes que resalten lo mejor de cada idea. Valoro mucho a los clientes que confían en mi proceso creativo, sabiendo que su visión siempre es parte del diseño.', bioEn: 'Originally from Los Angeles, California, and now based in Antigua, Guatemala. I\'ve been tattooing for six years. My work focuses on fine line, anime, and black & grey micro realism. I enjoy working on both small and large-scale pieces and always aim to create tattoos that bring out the best in each idea. I really value clients who trust my creative process while knowing their vision is always part of the design.', styles: ['Fineline', 'Anime', 'Micro Realism', 'Black & Grey'] },
    { name: 'BRANDON', specialty: 'Tradicional & Línea Fina', image: '/brandon/brandon.png', bioEs: 'Especializado en tatuajes tradicionales y línea fina.', bioEn: 'Specialized in traditional tattoos and fine line work.', experience: '+14 años', styles: ['Traditional', 'Fine Line', 'Black & Grey', 'Color'] },
{ name: 'ALEXA', specialty: 'Fineline & Minimalista', image: '/made/madealexa.png', experience: '5 años', bioEs: 'Mi nombre es Alexa y soy una tatuadora guatemalteca. Durante los últimos cinco años, he estado desarrollando mi técnica de línea fina, creando diseños ilustrativos y botánicos. Mi objetivo es crear diseños únicos y personalizados que se integren armoniosamente con tu cuerpo, fluyendo con naturalidad con sus formas y movimientos. Cada pieza está diseñada no solo para ser visualmente delicada y atemporal, sino para convertirse en algo significativo: arte que amarás y llevarás contigo toda la vida.', bioEn: 'My name is Alexa and I am a Guatemalan tattoo artist. Over the last five years, I have been developing my fine line technique, creating illustrative and botanical designs. My goal is to create unique, custom designs that integrate harmoniously with your body, flowing naturally with its shapes and movements. Each piece is designed not only to be visually delicate and timeless, but to become something meaningful — art that you will love and carry with you for life.', styles: ['Fineline', 'Minimalist', 'Dotwork', 'Botanical'] },
{ name: 'DANIEL', specialty: 'Traditional Tattoo', image: '/daniel/daniel.png', experience: '6 años', bioEs: 'Desde Antigua Guatemala, desarrollo un estilo enfocado en el tatuaje tradicional clásico, combinando líneas fuertes con detalles en puntillismo para darle profundidad y carácter a cada pieza. Trabajo con clientes de todo el mundo y ofrezco atención en inglés y español, buscando siempre crear tatuajes duraderos y con identidad.', bioEn: 'Based in Antigua Guatemala, I develop a style focused on classic traditional tattooing, combining bold lines with dotwork details to give depth and character to each piece. I work with clients from all over the world and offer service in both English and Spanish, always aiming to create tattoos that are lasting and full of identity.', styles: ['Traditional', 'Dotwork', 'Bold Lines'] },
    { name: 'LUIS', specialty: 'Blackwork Ilustrativo', image: '/luis/luis.png', experience: '3 años', bioEs: 'Especializado en blackwork ilustrativo y ornamentos.', bioEn: 'Specialized in illustrative blackwork and ornamental designs.', styles: ['Blackwork', 'Illustrative', 'Ornamental', 'Fineline'] },
{ name: 'ANGEL', specialty: 'Blackwork Ilustrativo', image: '/angel/angel.jpeg', experience: '3 años', bioEs: 'Con 3 años de experiencia en el mundo del tattoo, mi estilo se ha inclinado por una tendencia blackwork, enfatizando en blackwork ilustrativo y ornamentos filosos. No obstante, también disfruto de estilos como el fineline y black and grey. Hablando de arte en general, tengo obras en pintura al óleo, acrílico y acuarela, así como dibujos con carboncillo, grafito, crayones de colores y tinta usando rapidógrafos. Cuento con 3 años de arquitectura y 2 semestres de diseño gráfico, ambos en la Universidad de San Carlos de Guatemala.', bioEn: 'With 3 years of experience in the tattoo world, my style has gravitated toward a blackwork tendency, with an emphasis on illustrative blackwork and sharp ornamental designs. I also enjoy styles such as fineline and black and grey. Speaking of art in general, I have works in oil painting, acrylic, and watercolor, as well as drawings in charcoal, graphite, colored pencils, and ink using technical pens. I have 3 years of Architecture and 2 semesters of Graphic Design, both at the Universidad de San Carlos de Guatemala.', styles: ['Blackwork', 'Illustrative', 'Ornamental', 'Fineline'] }
 
  ];

  works: Work[] = [
    { id: 4, image: '/fotos/inaki1.JPG', style: 'Traditional', artist: 'Iñaki', showInGallery: true, showInProfile: true },
    { id: 5, image: '/fotos/inaki2.JPG', style: 'Fine Line', artist: 'Iñaki', showInGallery: true, showInProfile: false },
    { id: 12, image: '/made/4.jpeg', style: '', artist: 'Alexa', showInGallery: true, showInProfile: true },
    { id: 14, image: '/made/6.jpeg', style: '', artist: 'Alexa', showInGallery: true, showInProfile: true },
    { id: 17, image: '/abhram/3.png', style: '', artist: 'ABRAHAM LEMUS', showInGallery: true, showInProfile: true },
    { id: 19, image: '/abhram/5.jpeg', style: '', artist: 'ABRAHAM LEMUS', showInGallery: true, showInProfile: true },
    { id: 21, image: '/angel/2.jpg', style: '', artist: 'ANGEL', showInGallery: true, showInProfile: true },
    { id: 23, image: '/angel/4.jpg', style: '', artist: 'ANGEL', showInGallery: true, showInProfile: true },
    { id: 26, image: '/daniel/1.jpg', style: '', artist: 'DANIEL', showInGallery: true, showInProfile: true },
    { id: 29, image: '/daniel/4.jpg', style: '', artist: 'DANIEL', showInGallery: true, showInProfile: true },
    { id: 33, image: '/memmink/2.JPG', style: '', artist: 'MEMINK', showInGallery: true, showInProfile: true },
    { id: 35, image: '/memmink/4.JPEG', style: '', artist: 'MEMINK', showInGallery: true, showInProfile: true },
    { id: 37, image: '/memmink/6.JPEG', style: '', artist: 'MEMINK', showInGallery: true, showInProfile: true },
    { id: 39, image: '/kevin/2.jpeg', style: '', artist: 'KEVIN', showInGallery: true, showInProfile: true },
    { id: 41, image: '/kevin/4.jpeg', style: '', artist: 'KEVIN', showInGallery: true, showInProfile: true },
    { id: 44, image: '/juanpa/1.jpeg', style: '', artist: 'JUANPA', showInGallery: true, showInProfile: true },
    { id: 45, image: '/juanpa/2.jpeg', style: '', artist: 'JUANPA', showInGallery: true, showInProfile: true },
    { id: 47, image: '/brandon/2.JPG', style: '', artist: 'BRANDON', showInGallery: true, showInProfile: true },
    { id: 49, image: '/brandon/4.jpg', style: '', artist: 'BRANDON', showInGallery: true, showInProfile: true },
    { id: 50, image: '/brandon/5.jpg', style: '', artist: 'BRANDON', showInGallery: true, showInProfile: true },
    { id: 51, image: '/luis/2.jpg', style: '', artist: 'LUIS', showInGallery: true, showInProfile: true },
    { id: 52, image: '/luis/4.jpg', style: '', artist: 'LUIS', showInGallery: true, showInProfile: true },
    { id: 53, image: '/luis/5.jpg', style: '', artist: 'LUIS', showInGallery: true, showInProfile: true }
  ];

  constructor() {}

  get galleryWorks(): Work[] { return this.works.filter(w => w.showInGallery); }

  ngOnInit(): void {
    inject(); // Vercel Analytics
    this.detectLanguage();
    this.buildFaq();
    this.initRevealObserver();
  }

  ngAfterViewInit(): void {
    this.forcePlayVideo(this.heroVideo);
    this.forcePlayVideo(this.navLogoVideo);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  private forcePlayVideo(ref: ElementRef<HTMLVideoElement> | undefined): void {
    const video = ref?.nativeElement;
    if (!video) return;

    // Ensure muted (required for autoplay policy)
    video.muted = true;

    // Try to play immediately
    const tryPlay = () => {
      video.play().catch(() => {
        // If blocked, retry on first user interaction
        const playOnInteraction = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
          document.removeEventListener('scroll', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction, { once: true });
        document.addEventListener('touchstart', playOnInteraction, { once: true });
        document.addEventListener('scroll', playOnInteraction, { once: true });
      });
    };

    // If video is ready, play now; otherwise wait for it
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true });
      // Also try after a short delay as fallback
      setTimeout(tryPlay, 500);
    }
  }

  detectLanguage(): void {
    const lang = navigator.language || 'en';
    this.currentLang = this.spanishCodes.some(c => lang.toLowerCase().startsWith(c.toLowerCase())) ? 'es' : 'en';
  }

  t(key: string): string { return this.translations[key]?.[this.currentLang] || key; }
  getArtistBio(): string { if (!this.selectedArtist) return ''; return this.currentLang === 'es' ? this.selectedArtist.bioEs : this.selectedArtist.bioEn; }
  getArtistBioFor(artist: Artist): string { return this.currentLang === 'es' ? artist.bioEs : artist.bioEn; }

  buildFaq(): void {
    const data = this.currentLang === 'es' ? this.faqDataEs : this.faqDataEn;
    this.faqItems = data.map(d => ({ ...d, open: false }));
  }

  toggleFaq(i: number): void { this.faqItems[i].open = !this.faqItems[i].open; }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.scrollTicking) {
      requestAnimationFrame(() => { this.scrolled = window.scrollY > 60; this.scrollTicking = false; });
      this.scrollTicking = true;
    }
  }

  private initRevealObserver(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); this.observer!.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.01 });
    requestAnimationFrame(() => { document.querySelectorAll('.reveal').forEach(el => this.observer!.observe(el)); });
  }

  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : ''; }

  openArtistProfile(artist: Artist): void {
    this.selectedArtist = artist;
    const fn = artist.name.split(' ')[0].toLowerCase();
    this.artistWorks = this.works.filter(w => w.showInProfile && (w.artist.toLowerCase().includes(fn) || artist.name.toLowerCase().includes(w.artist.toLowerCase())));
    document.body.style.overflow = 'hidden';
  }

  closeArtistProfile(): void { this.selectedArtist = null; this.artistWorks = []; document.body.style.overflow = ''; }

  openImageViewer(image: string): void {
    this.viewerImage = image;
    document.body.style.overflow = 'hidden';
  }

  closeImageViewer(): void {
    this.viewerImage = null;
    if (!this.selectedArtist) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.viewerImage) { this.closeImageViewer(); return; }
    if (this.selectedArtist) this.closeArtistProfile();
    if (this.mobileMenuOpen) this.toggleMobileMenu();
  }
}