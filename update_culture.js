
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(process.cwd(), 'src/data/cultural-meanings.json');
console.log('Reading from:', filePath);

if (!fs.existsSync(filePath)) {
    console.error('Error: File does not exist at', filePath);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newRegions = {
  latinAmerican: {
    red: {
      general: ["passion", "religion", "revolution", "fire"],
      business: ["vibrant", "attention"],
      wedding: ["passion", "love"],
      mourning: ["not typically used"]
    },
    blue: {
      general: ["trust", "mourning (Mexico)", "sky", "spirituality"],
      business: ["trust", "reliability"],
      wedding: ["fidelity"],
      mourning: ["associated with mourning in Mexico"]
    },
    green: {
      general: ["nature", "hope", "patriotism (Mexico, Brazil)"],
      business: ["growth", "agriculture"],
      wedding: ["hope"],
      mourning: ["not typically used"]
    },
    yellow: {
      general: ["sun", "mourning", "death", "caution"],
      business: ["caution", "low cost"],
      wedding: ["avoided in some regions (bad luck)"],
      mourning: ["traditional mourning color"]
    },
    white: {
      general: ["purity", "peace", "modesty"],
      business: ["clean", "medical"],
      wedding: ["traditional bridal color"],
      mourning: ["purity of the soul"]
    },
    black: {
      general: ["death", "mourning", "masculinity", "mystery"],
      business: ["formal", "luxury"],
      wedding: ["avoided"],
      mourning: ["traditional mourning color"]
    },
    purple: {
      general: ["death", "mourning (Brazil)", "Catholicism", "royalty"],
      business: ["luxury", "avoid in Brazil"],
      wedding: ["avoided in some regions"],
      mourning: ["widely associated with funerals (Brazil)"]
    },
    orange: {
      general: ["sun", "earth", "warmth"],
      business: ["friendly", "vibrant"],
      wedding: ["celebration"],
      mourning: ["not typically used"]
    },
    pink: {
      general: ["femininity", "architecture (Mexico)", "joy"],
      business: ["feminine products"],
      wedding: ["romance"],
      mourning: ["not typically used"]
    },
    brown: {
      general: ["earth", "disapproval (Nicaragua)", "humility"],
      business: ["agricultural", "rustic"],
      wedding: ["not traditional"],
      mourning: ["not typically used"]
    },
    gold: {
      general: ["wealth", "sun", "church"],
      business: ["luxury"],
      wedding: ["prosperity"],
      mourning: ["not typically used"]
    }
  },
  african: {
    red: {
      general: ["bloodshed", "death", "vitality", "aggression"],
      business: ["power", "warning"],
      wedding: ["traditional in some cultures"],
      mourning: ["associated with death (South Africa)"]
    },
    blue: {
      general: ["love", "harmony", "togetherness", "peace"],
      business: ["trust", "calm"],
      wedding: ["love", "fidelity"],
      mourning: ["not typically used"]
    },
    green: {
      general: ["growth", "prosperity", "fertility", "nature"],
      business: ["agriculture", "success"],
      wedding: ["fertility"],
      mourning: ["not typically used"]
    },
    yellow: {
      general: ["wealth", "high rank", "fertility", "beauty"],
      business: ["premium", "wealth"],
      wedding: ["wealth", "fertility"],
      mourning: ["reserved for high rank in some cultures"]
    },
    white: {
      general: ["spirituality", "purity", "peace", "death (West Africa)"],
      business: ["medical", "peace"],
      wedding: ["purity"],
      mourning: ["associated with spirit world"]
    },
    black: {
      general: ["maturity", "masculinity", "spirituality"],
      business: ["formal"],
      wedding: ["not traditional"],
      mourning: ["darkness", "loss"]
    },
    purple: {
      general: ["royalty", "high status", "wealth", "femininity"],
      business: ["premium", "luxury"],
      wedding: ["high status"],
      mourning: ["not typically used"]
    },
    orange: {
      general: ["earth", "transition", "warmth"],
      business: ["friendly"],
      wedding: ["celebration"],
      mourning: ["not typically used"]
    },
    pink: {
      general: ["poverty (some regions)", "femininity"],
      business: ["feminine"],
      wedding: ["modern influence"],
      mourning: ["not typically used"]
    },
    brown: {
      general: ["healing", "earth", "motherhood"],
      business: ["traditional", "natural"],
      wedding: ["not traditional"],
      mourning: ["not typically used"]
    },
    gold: {
      general: ["wealth", "longevity", "high status"],
      business: ["premium"],
      wedding: ["prosperity"],
      mourning: ["celebrating long life"]
    }
  },
  easternEuropean: {
    red: {
      general: ["beauty", "protection against evil", "communism (history)"],
      business: ["attention", "power"],
      wedding: ["protection", "beauty"],
      mourning: ["not typically used"]
    },
    blue: {
      general: ["immortality", "royalty", "calm"],
      business: ["trust", "corporate"],
      wedding: ["fidelity"],
      mourning: ["not typically used"]
    },
    green: {
      general: ["spring", "life", "youth", "forest"],
      business: ["eco", "growth"],
      wedding: ["fertility", "spring"],
      mourning: ["not typically used"]
    },
    yellow: {
      general: ["jealousy", "treason", "gold", "sun"],
      business: ["caution"],
      wedding: ["avoided (jealousy)"],
      mourning: ["not typically used"]
    },
    white: {
      general: ["purity", "light", "winter", "peace"],
      business: ["clean"],
      wedding: ["traditional"],
      mourning: ["traditional in Slavic history"]
    },
    black: {
      general: ["mourning", "mystery", "formality", "soil"],
      business: ["formal"],
      wedding: ["not traditional"],
      mourning: ["standard mourning color"]
    },
    purple: {
      general: ["royalty", "wealth", "piety"],
      business: ["luxury"],
      wedding: ["elegance"],
      mourning: ["fasting", "piety"]
    },
    orange: {
      general: ["creativity", "autumn", "harvest"],
      business: ["modern"],
      wedding: ["harvest themes"],
      mourning: ["not typically used"]
    },
    pink: {
      general: ["romance", "health", "youth"],
      business: ["cosmetics"],
      wedding: ["romance"],
      mourning: ["not typically used"]
    },
    brown: {
      general: ["earth", "soil", "humility"],
      business: ["agricultural"],
      wedding: ["not traditional"],
      mourning: ["not typically used"]
    },
    gold: {
      general: ["wealth", "spirituality", "icons"],
      business: ["luxury"],
      wedding: ["wealth"],
      mourning: ["not typically used"]
    }
  }
};

for (const [colorName, regionData] of Object.entries(data)) {
  if (newRegions.latinAmerican[colorName]) {
    regionData['latinAmerican'] = newRegions.latinAmerican[colorName];
  }
  if (newRegions.african[colorName]) {
    regionData['african'] = newRegions.african[colorName];
  }
  if (newRegions.easternEuropean[colorName]) {
    regionData['easternEuropean'] = newRegions.easternEuropean[colorName];
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Cultural meanings updated successfully.');
