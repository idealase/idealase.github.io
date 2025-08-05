import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import emailjs from '@emailjs/browser';
import PBCLogo from './PBC.jpg';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #e1e1e1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #2e3440 0%, #3b4252 100%);
  border-radius: 10px;
  border: 1px solid #434c5e;
`;

const HeaderTitle = styled.h1`
  color: #88c0d0;
  font-size: 2.5em;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const HeaderDescription = styled.p`
  color: #d8dee9;
  font-size: 1.1em;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
`;

const BeerGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
`;

const BeerCard = styled.div`
  background-color: #2e3440;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #434c5e;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  }
`;

const BeerImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: #3b4252;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #81a1c1;
  font-size: 14px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const BeerName = styled.div`
  color: #88c0d0;
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 8px;
`;

const BeerBrewery = styled.div`
  color: #81a1c1;
  font-weight: 500;
  margin-bottom: 5px;
`;

const BeerStyle = styled.div`
  color: #8fbcbb;
  font-style: italic;
  margin-bottom: 10px;
  font-size: 0.9em;
`;

const BeerDescription = styled.div`
  color: #d8dee9;
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 0.95em;
`;

const BeerRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Stars = styled.div`
  color: #ebcb8b;
  font-size: 1.2em;
`;

const RatingNumber = styled.div`
  color: #e5e9f0;
  font-weight: bold;
`;

const FormSection = styled.div`
  background-color: #2e3440;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #434c5e;
  margin-top: 40px;
`;

const FormTitle = styled.h3`
  color: #88c0d0;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.5em;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #d8dee9;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  background-color: #3b4252;
  border: 1px solid #434c5e;
  border-radius: 6px;
  padding: 10px;
  color: #e5e9f0;
  font-family: 'Fira Code', monospace;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #88c0d0;
    box-shadow: 0 0 0 2px rgba(136, 192, 208, 0.2);
  }
`;

const Select = styled.select`
  background-color: #3b4252;
  border: 1px solid #434c5e;
  border-radius: 6px;
  padding: 10px;
  color: #e5e9f0;
  font-family: 'Fira Code', monospace;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #88c0d0;
    box-shadow: 0 0 0 2px rgba(136, 192, 208, 0.2);
  }
`;

const TextArea = styled.textarea`
  background-color: #3b4252;
  border: 1px solid #434c5e;
  border-radius: 6px;
  padding: 10px;
  color: #e5e9f0;
  font-family: 'Fira Code', monospace;
  transition: border-color 0.3s ease;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #88c0d0;
    box-shadow: 0 0 0 2px rgba(136, 192, 208, 0.2);
  }
`;

const RatingInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;
`;

const RatingStar = styled.span<{ active: boolean }>`
  font-size: 24px;
  color: ${props => props.active ? '#ebcb8b' : '#4c566a'};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #ebcb8b;
  }
`;

const RatingDisplay = styled.span`
  color: #d8dee9;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #5e81ac 0%, #81a1c1 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-family: 'Fira Code', monospace;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #81a1c1 0%, #88c0d0 100%);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div<{ show: boolean }>`
  background-color: #a3be8c;
  color: #2e3440;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  display: ${props => props.show ? 'block' : 'none'};
  animation: ${props => props.show ? 'slideDown 0.5s ease' : 'none'};

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

interface Beer {
  name: string;
  brewery: string;
  style: string;
  description: string;
  rating: number;
  imageUrl?: string;
}

const defaultBeers: Beer[] = [
  {
    name: 'Little Dove Pale Ale',
    brewery: 'Little Creatures',
    style: 'Pale Ale',
    description: 'A crisp and hoppy pale ale with citrus notes and a clean finish. Perfect for Perth\'s sunny weather.',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400'
  },
  {
    name: 'Feral Hop Hog IPA',
    brewery: 'Feral Brewing',
    style: 'IPA',
    description: 'Bold and bitter with tropical fruit aromas. A true West Australian classic that showcases local hops.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400'
  },
  {
    name: 'Gage Roads Single Fin',
    brewery: 'Gage Roads',
    style: 'Lager',
    description: 'Light, refreshing summer ale with subtle hop character. Great for beach days and BBQs.',
    rating: 3,
    imageUrl: 'https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?w=400'
  },
  {
    name: 'Rocky Ridge Rifleman',
    brewery: 'Rocky Ridge Brewing',
    style: 'IPA',
    description: 'Smooth West Coast IPA with pine and grapefruit notes. Balanced bitterness with a malty backbone.',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400'
  },
  {
    name: 'Nail Red Ale',
    brewery: 'Nail Brewing',
    style: 'Red Ale',
    description: 'Rich caramel maltiness with earthy hop character. A warming beer perfect for Perth winter evenings.',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=400'
  },
  {
    name: 'Blackman\'s Porter',
    brewery: 'Blackman\'s Brewery',
    style: 'Porter',
    description: 'Dark and roasty with chocolate and coffee notes. Creamy texture with a smooth, dry finish.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'
  }
];

const PerthBeerCuratorPage: React.FC = () => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    beerName: '',
    brewery: '',
    style: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    document.title = 'PBC';

    // Initialize EmailJS
    emailjs.init('sBWi2Myw71iv3sKXL');

    // Load beers from localStorage
    const savedBeers = localStorage.getItem('perthBeers');
    if (savedBeers) {
      setBeers(JSON.parse(savedBeers));
    } else {
      localStorage.setItem('perthBeers', JSON.stringify(defaultBeers));
      setBeers(defaultBeers);
    }
  }, []);

  const saveBeers = (newBeers: Beer[]) => {
    localStorage.setItem('perthBeers', JSON.stringify(newBeers));
  };

  const generateStars = (rating: number) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? '★' : '☆';
    }
    return stars;
  };

  const handleRatingClick = (rating: number) => {
    setCurrentRating(rating);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.beerName || !formData.brewery || !formData.style || !currentRating) {
      alert('Please fill in all required fields and select a rating.');
      return;
    }

    setIsSubmitting(true);

    const newBeer: Beer = {
      name: formData.beerName.trim(),
      brewery: formData.brewery.trim(),
      style: formData.style,
      description: formData.description.trim(),
      rating: currentRating,
      imageUrl: formData.imageUrl.trim()
    };

    try {
      // Send email notification via EmailJS
      const emailParams = {
        beer_name: newBeer.name,
        brewery: newBeer.brewery,
        style: newBeer.style,
        rating: `${newBeer.rating}/5 stars`,
        description: newBeer.description,
        image_url: newBeer.imageUrl || 'Not provided',
        from_name: 'Perth Beer Curator',
        to_name: 'Admin'
      };

      await emailjs.send('service_bhhay7a', 'template_zxvpn0b', emailParams);

      // Add beer to the collection
      const updatedBeers = [newBeer, ...beers];
      setBeers(updatedBeers);
      saveBeers(updatedBeers);

      // Show success message
      setSuccessMessage('Beer review added successfully and notification sent! 🍻📧');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);

      // Reset form
      setFormData({
        beerName: '',
        brewery: '',
        style: '',
        description: '',
        imageUrl: ''
      });
      setCurrentRating(0);

    } catch (error) {
      console.error('EmailJS Error:', error);

      // Still add beer locally even if email fails
      const updatedBeers = [newBeer, ...beers];
      setBeers(updatedBeers);
      saveBeers(updatedBeers);

      // Show success message (noting email issue)
      setSuccessMessage('Beer review added successfully! 🍻\n(Email notification failed, but review was saved)');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);

      // Reset form
      setFormData({
        beerName: '',
        brewery: '',
        style: '',
        description: '',
        imageUrl: ''
      });
      setCurrentRating(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Header>
        <LogoContainer>
          <Logo src={PBCLogo} alt="Perth Beer Curator Logo" />
          <HeaderTitle>🍺 Perth Beer Curator</HeaderTitle>
        </LogoContainer>
        <HeaderDescription>
          Discover and share the finest craft beers from Perth and Western Australia.
          Join our community of beer enthusiasts as we explore local breweries,
          taste exceptional brews, and document our beer journey together.
        </HeaderDescription>
      </Header>

      <SuccessMessage show={showSuccess}>
        {successMessage}
      </SuccessMessage>

      <BeerGallery>
        {beers.map((beer, index) => (
          <BeerCard key={index}>
            <BeerImage>
              {beer.imageUrl ? (
                <img
                  src={beer.imageUrl}
                  alt={beer.name}
                  onError={(e) => {
                    e.currentTarget.parentElement!.innerHTML = '📷 Image not available';
                  }}
                />
              ) : (
                '📷 No image available'
              )}
            </BeerImage>
            <BeerName>{beer.name}</BeerName>
            <BeerBrewery>{beer.brewery}</BeerBrewery>
            <BeerStyle>{beer.style}</BeerStyle>
            <BeerDescription>{beer.description || 'No description available.'}</BeerDescription>
            <BeerRating>
              <Stars>{generateStars(beer.rating)}</Stars>
              <RatingNumber>{beer.rating}/5</RatingNumber>
            </BeerRating>
          </BeerCard>
        ))}
      </BeerGallery>

      <FormSection>
        <FormTitle>📝 Add Your Beer Review</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label htmlFor="beerName">Beer Name *</Label>
              <Input
                type="text"
                id="beerName"
                name="beerName"
                value={formData.beerName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="brewery">Brewery *</Label>
              <Input
                type="text"
                id="brewery"
                name="brewery"
                value={formData.brewery}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="style">Beer Style *</Label>
              <Select
                id="style"
                name="style"
                value={formData.style}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a style</option>
                <option value="IPA">IPA</option>
                <option value="Pale Ale">Pale Ale</option>
                <option value="Lager">Lager</option>
                <option value="Stout">Stout</option>
                <option value="Porter">Porter</option>
                <option value="Wheat Beer">Wheat Beer</option>
                <option value="Pilsner">Pilsner</option>
                <option value="Sour">Sour</option>
                <option value="Saison">Saison</option>
                <option value="Belgian">Belgian</option>
                <option value="Other">Other</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Rating *</Label>
              <RatingInput>
                <RatingStars>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <RatingStar
                      key={rating}
                      active={rating <= currentRating}
                      onClick={() => handleRatingClick(rating)}
                    >
                      ★
                    </RatingStar>
                  ))}
                </RatingStars>
                <RatingDisplay>{currentRating}/5</RatingDisplay>
              </RatingInput>
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <Label htmlFor="imageUrl">Beer Photo URL (optional)</Label>
            <Input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/beer-photo.jpg"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description (optional)</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Share your thoughts about this beer..."
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Add Beer Review'}
          </SubmitButton>
        </form>
      </FormSection>
    </Container>
  );
};

export default PerthBeerCuratorPage;
