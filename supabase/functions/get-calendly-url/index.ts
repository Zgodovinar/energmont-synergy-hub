import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // For now, return a hardcoded Calendly URL for testing
    // Replace this with your actual Calendly URL
    const calendlyUrl = "https://calendly.com/svaljzgodovina";
    
    console.log('Returning Calendly URL:', calendlyUrl);

    return new Response(
      JSON.stringify({ calendly_url: calendlyUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch Calendly URL',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})