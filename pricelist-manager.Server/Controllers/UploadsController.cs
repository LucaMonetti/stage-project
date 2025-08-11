using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;

namespace pricelist_manager.Server.Controllers
{
    [ApiController]
    [Route("api/uploads")]
    public class UploadsController : ControllerBase
    {

        private readonly string TargetFolder = Path.Combine(Directory.GetCurrentDirectory(), "public", "uploads");

        [HttpGet("{imageName}")]
        public IActionResult GetImage(string imageName)
        {
            // Impedisci path traversal
            if (string.IsNullOrWhiteSpace(imageName) || imageName.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
                return BadRequest("Nome file non valido.");

            var filePath = Path.Combine(TargetFolder, imageName);

            // Verifica che il file sia nella cartella specifica
            if (!System.IO.File.Exists(filePath))
                return NotFound("Immagine non trovata.");

            // Verifica che il file sia un png
            if (Path.GetExtension(filePath).ToLower() != ".png")
                return BadRequest("Il file deve essere un'immagine PNG.");

            // Verifica il formato reale del file
            try
            {
                using var stream = System.IO.File.OpenRead(filePath);
                using var image = Image.Load(stream);

                // Imposta il content-type corretto
                var contentType = "image/png";

                // Ritorna il file come stream
                stream.Position = 0; // Reset per la lettura
                return File(System.IO.File.OpenRead(filePath), contentType);
            }
            catch
            {
                return BadRequest("Errore durante la lettura dell'immagine.");
            }
        }

    }
}
