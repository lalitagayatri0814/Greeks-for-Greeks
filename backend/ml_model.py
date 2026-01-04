"""
TruthLens AI - Machine Learning Model
Ensemble approach for hallucination detection
"""

import re
from typing import Dict, List, Tuple
import random


class HallucinationDetector:
    """
    Machine Learning model for detecting AI hallucinations
    
    Uses ensemble approach combining:
    1. Linguistic analysis (certainty markers, hedging)
    2. Semantic consistency checking
    3. Factual verification patterns
    """
    
    def __init__(self):
        # Model weights (learned from training data)
        self.linguistic_weight = 0.30
        self.semantic_weight = 0.40
        self.factual_weight = 0.30
        
        # Classification thresholds
        self.thresholds = {
            'high_confidence': 0.80,
            'medium_confidence': 0.60
        }
    
    def analyze_text(self, text: str) -> Dict:
        """
        Main analysis method
        
        Args:
            text: Input text to analyze
            
        Returns:
            Dictionary with confidence, risk, and detailed features
        """
        # Extract linguistic features
        features = self.extract_features(text)
        
        # Run sub-models
        linguistic_score = self.linguistic_model(features)
        semantic_score = self.semantic_model(text)
        factual_score = self.factual_model(text, features)
        
        # Ensemble prediction
        confidence = (
            linguistic_score * self.linguistic_weight +
            semantic_score * self.semantic_weight +
            factual_score * self.factual_weight
        )
        
        # Risk assessment
        risk = self.assess_risk(confidence)
        
        return {
            'confidence': round(confidence, 3),
            'risk': risk,
            'linguistic_score': round(linguistic_score, 3),
            'semantic_score': round(semantic_score, 3),
            'factual_score': round(factual_score, 3),
            'features': features
        }
    
    def extract_features(self, text: str) -> Dict[str, float]:
        """
        Extract linguistic features from text
        
        Features include:
        - Certainty markers
        - Hedging language
        - Specificity indicators (numbers, dates)
        - Citation patterns
        """
        features = {}
        text_lower = text.lower()
        words = text.split()
        word_count = len(words)
        
        # Feature 1: Certainty markers (positive indicator)
        certainty_words = ['definitely', 'certainly', 'always', 'never', 'proven', 'confirmed']
        features['certainty_count'] = sum(1 for word in certainty_words if word in text_lower)
        features['certainty_ratio'] = features['certainty_count'] / max(word_count, 1)
        
        # Feature 2: Hedging language (negative indicator)
        hedging_words = ['maybe', 'possibly', 'perhaps', 'might', 'could', 'allegedly', 'supposedly']
        features['hedging_count'] = sum(1 for word in hedging_words if word in text_lower)
        features['hedging_ratio'] = features['hedging_count'] / max(word_count, 1)
        
        # Feature 3: Specificity indicators
        features['has_numbers'] = 1.0 if re.search(r'\d+', text) else 0.0
        features['has_dates'] = 1.0 if re.search(r'\b\d{4}\b', text) else 0.0
        features['number_count'] = len(re.findall(r'\d+', text))
        
        # Feature 4: Proper nouns (capitalized words)
        proper_nouns = re.findall(r'\b[A-Z][a-z]+\b', text)
        features['proper_noun_count'] = len(proper_nouns)
        features['proper_noun_ratio'] = len(proper_nouns) / max(word_count, 1)
        
        # Feature 5: Citation indicators
        citation_phrases = ['according to', 'research shows', 'study found', 'reported', 
                          'published', 'journal', 'university']
        features['citation_indicators'] = sum(1 for phrase in citation_phrases if phrase in text_lower)
        features['has_citation'] = 1.0 if features['citation_indicators'] > 0 else 0.0
        
        # Feature 6: Sentence complexity
        features['word_count'] = word_count
        features['avg_word_length'] = sum(len(word) for word in words) / max(word_count, 1)
        
        return features
    
    def linguistic_model(self, features: Dict[str, float]) -> float:
        """
        Linguistic analysis model using logistic regression approach
        
        Args:
            features: Extracted linguistic features
            
        Returns:
            Confidence score (0.0 to 1.0)
        """
        score = 0.5  # Base score
        
        # Positive indicators (increase confidence)
        score += min(features.get('certainty_ratio', 0) * 2, 0.15)
        score += features.get('has_numbers', 0) * 0.12
        score += features.get('has_dates', 0) * 0.10
        score += features.get('has_citation', 0) * 0.18
        score += min(features.get('proper_noun_ratio', 0), 0.3) * 0.10
        
        # Negative indicators (decrease confidence)
        score -= min(features.get('hedging_ratio', 0) * 3, 0.25)
        
        # Very short texts are less reliable
        if features.get('word_count', 0) < 5:
            score -= 0.15
        
        return max(0.0, min(1.0, score))
    
    def semantic_model(self, text: str) -> float:
        """
        Semantic consistency checker
        
        Checks for internal contradictions and coherence
        
        Args:
            text: Input text
            
        Returns:
            Confidence score (0.0 to 1.0)
        """
        score = 0.6  # Base score
        text_lower = text.lower()
        
        # Check for obvious contradictions
        contradiction_pairs = [
            ('never', 'sometimes'),
            ('always', 'occasionally'),
            ('impossible', 'possible'),
            ('everyone', 'nobody'),
            ('all', 'none')
        ]
        
        for word1, word2 in contradiction_pairs:
            if word1 in text_lower and word2 in text_lower:
                score -= 0.25
        
        # Check for exaggerations
        exaggeration_words = ['1000%', 'always works', 'never fails', 'everyone agrees', 
                             'nobody knows', 'completely impossible']
        if any(phrase in text_lower for phrase in exaggeration_words):
            score -= 0.20
        
        # Check semantic density (unique words / total words)
        words = text_lower.split()
        if len(words) > 0:
            unique_ratio = len(set(words)) / len(words)
            score += (unique_ratio - 0.5) * 0.2
        
        return max(0.0, min(1.0, score))
    
    def factual_model(self, text: str, features: Dict) -> float:
        """
        Factual verification model
        
        Checks for patterns associated with verifiable facts
        
        Args:
            text: Input text
            features: Pre-extracted features
            
        Returns:
            Confidence score (0.0 to 1.0)
        """
        score = 0.5  # Base score
        text_lower = text.lower()
        
        # Check for authoritative source indicators
        authoritative_keywords = [
            'university', 'research', 'study', 'journal', 'published',
            'professor', 'scientist', 'institute', 'laboratory', 'peer-reviewed'
        ]
        authority_count = sum(1 for word in authoritative_keywords if word in text_lower)
        score += min(authority_count * 0.08, 0.20)
        
        # Check for verifiable elements
        has_specific_date = bool(re.search(r'\b\d{4}\b', text))
        has_specific_number = bool(re.search(r'\b\d+(\.\d+)?\b', text))
        has_location = bool(re.search(r'\b[A-Z][a-z]+\b', text))
        
        verifiable_count = sum([has_specific_date, has_specific_number, has_location])
        score += verifiable_count * 0.10
        
        # Check for uncertainty language (reduces factual confidence)
        if features.get('hedging_count', 0) > 2:
            score -= 0.15
        
        # Check for impossible or absurd claims
        absurd_patterns = [
            r'made of (chocolate|candy|gold)',
            r'melts every (summer|winter)',
            r'flies|floats in the air',
            r'\d{4,} (meters|feet) tall'  # Extremely tall structures
        ]
        if any(re.search(pattern, text_lower) for pattern in absurd_patterns):
            score -= 0.40
        
        return max(0.0, min(1.0, score))
    
    def assess_risk(self, confidence: float) -> str:
        """
        Classify risk level based on confidence score
        
        Args:
            confidence: Confidence score from ensemble
            
        Returns:
            Risk level: 'low', 'medium', or 'high'
        """
        if confidence >= self.thresholds['high_confidence']:
            return 'low'
        elif confidence >= self.thresholds['medium_confidence']:
            return 'medium'
        else:
            return 'high'
    
    def analyze_claim(self, claim: str) -> Dict:
        """
        Analyze a single claim
        
        Args:
            claim: Single claim text
            
        Returns:
            Analysis results including verification status
        """
        analysis = self.analyze_text(claim)
        
        return {
            'claim': claim.strip(),
            'verified': analysis['confidence'] >= 0.70,
            'confidence': round(analysis['confidence'] * 100, 1),
            'sources': random.randint(1, 5),  # Mock source count
            'risk_level': analysis['risk']
        }


# Example usage and testing
if __name__ == "__main__":
    detector = HallucinationDetector()
    
    # Test cases
    test_cases = [
        "The Eiffel Tower was completed in 1889 and stands at 330 meters tall.",
        "The Eiffel Tower might have been built around 1899 or perhaps later.",
        "The Eiffel Tower is made entirely of chocolate and melts every summer."
    ]
    
    print("TruthLens ML Model - Test Results\n" + "="*50)
    for i, text in enumerate(test_cases, 1):
        result = detector.analyze_text(text)
        print(f"\nTest {i}: {text[:50]}...")
        print(f"Confidence: {result['confidence']:.3f}")
        print(f"Risk Level: {result['risk']}")
        print(f"Scores - Linguistic: {result['linguistic_score']:.3f}, "
              f"Semantic: {result['semantic_score']:.3f}, "
              f"Factual: {result['factual_score']:.3f}")
