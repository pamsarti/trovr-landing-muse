import { Instagram, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function ContactChannels({ context, dark = false }: { context?: string; dark?: boolean }) {
  const message = context ? `Olá, Trovr! Quero conversar sobre ${context}.` : "Olá, Trovr! Quero conversar sobre uma viagem.";
  return (
    <div className={`contact-channels${dark ? " contact-channels-dark" : ""}`}>
      <div className="contact-channel-actions">
        <a href={`https://wa.me/5511936215678?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true" />WhatsApp</a>
        <a href="https://www.instagram.com/_trovr/" target="_blank" rel="noopener noreferrer"><Instagram size={20} aria-hidden="true" />Instagram</a>
      </div>
      <div className="contact-channel-links">
        <Link to="/roteiro">Sou operador ou quero propor uma parceria →</Link>
        <button type="button" onClick={() => window.dispatchEvent(new Event("trovr-open-privacy"))}>Preferências de privacidade</button>
      </div>
    </div>
  );
}
