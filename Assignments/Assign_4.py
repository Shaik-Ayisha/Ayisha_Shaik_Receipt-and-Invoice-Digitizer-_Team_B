import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Download required datasets
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('averaged_perceptron_tagger_eng')


# ------------------------------
# 1. Sentence and Word Tokenization
# ------------------------------
text = "Natural Language Processing is interesting. NLTK makes it easy."

sentences = sent_tokenize(text)
print("Sentences:", sentences)

words = word_tokenize(text)
print("Words:", words)

# ------------------------------
# 2. Stopword Removal
# ------------------------------
text2 = "This is a simple example for removing stopwords using NLTK."

words2 = word_tokenize(text2)

filtered_words = []

for word in words2:
    if word.lower() not in stopwords.words('english'):
        filtered_words.append(word)

print("Filtered words:", filtered_words)

# ------------------------------
# 3. Stemming
# ------------------------------
ps = PorterStemmer()

word_list = ["playing", "played", "plays", "player"]

print("Stemming:")
for word in word_list:
    print(ps.stem(word))

# ------------------------------
# 4. POS Tagging
# ------------------------------
text3 = "NLTK is useful for Natural Language Processing"

words3 = word_tokenize(text3)

pos = nltk.pos_tag(words3)

print("POS Tags:", pos)