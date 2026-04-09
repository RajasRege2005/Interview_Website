import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

const DELAY_MS = 500; 
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function seedDatabase() {
  console.log("Fetching master list of problems...");
  
  try {
    const listResponse = await fetch('https://leetcode-api-pied.vercel.app/problems');
    const problemsList = await listResponse.json();
    
    console.log(`Found ${problemsList.length} problems. Starting detailed fetch...`);

    for (const problem of problemsList) {
      console.log(`Fetching details for: ${problem.title_slug}...`);
      
      try {
        const detailResponse = await fetch(`https://leetcode-api-pied.vercel.app/problem/${problem.title_slug}`);
        
        if (!detailResponse.ok) {
          console.warn(`Failed to fetch details for ${problem.title_slug}. Skipping...`);
          continue; 
        }

        const details = await detailResponse.json();

        const record = {
          id: parseInt(problem.id),
          frontend_id: problem.frontend_id,
          title: problem.title,
          title_slug: problem.title_slug,
          difficulty: problem.difficulty,
          content: details.content,
          hints: details.hints || [],
          topic_tags: details.topicTags || [],
          solution: details.solution || null,
          stats: details.stats ? JSON.parse(details.stats) : null,
          likes: details.likes || 0,
          dislikes: details.dislikes || 0,
          url: problem.url
        };

        const { error } = await supabase
          .from('coding_questions')
          .upsert(record, { onConflict: 'id' });

        if (error) {
          console.error(`Database error for ${problem.title_slug}:`, error.message);
        } else {
          console.log(`Successfully saved: ${problem.title}`);
        }

        await sleep(DELAY_MS);

      } catch (err) {
        console.error(`Error processing ${problem.title_slug}:`, err);
      }
    }
    

  } catch (error) {
    console.error("Fatal error during script execution:", error);
  }
}

seedDatabase();