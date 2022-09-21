import xuandieuChar from '../assets/images/characters/butterfly_cr.jpg';
import kieuChar from '../assets/images/characters/kieu_cr.png';
import harrypotterChar from '../assets/images/characters/harry_cr.jpg';
import ireneadlerChar from '../assets/images/characters/adler_cr.jpg';

function PortraitCharacter({ theme }) {
	let [source, altText] = [null, ''];
	switch (theme) {
		case 'theme-xuandieu':
			// Xuân Diệu
			source = xuandieuChar;
			altText = 'A butterfly';
			break;
		case 'theme-truyenkieu':
			// Truyện Kiều
			source = kieuChar;
			altText = `Vuong Thuy Kieu portrait. She's holding an instrument`;

			break;
		case 'theme-harrypotter':
			// Harry Potter
			source = harrypotterChar;
			altText = `Harry Potter portrait. He's wearing an eyeglasses`;
			break;
		case 'theme-ireneadler':
			// Irene Adler
			source = ireneadlerChar;
			altText = 'Irene Adler portrait. A sketching about her';
			break;
		default:
	}
	return (
		<img
			src={source}
			alt={altText}
			style={{ marginBottom: '50px', maxWidth: '80vw' }}
		/>
	);
}
export default PortraitCharacter;
