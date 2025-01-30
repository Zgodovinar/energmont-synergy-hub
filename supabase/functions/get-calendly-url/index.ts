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
    // Call the Calendly wrapper using the Supabase project URL
    const response = await fetch('https://sqqboxzharzedgqdljfp.supabase.co/functions/v1/calendly-wrapper', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Calendly wrapper responded with status: ${response.status}`);
    }

    const data = await response.json()

    if (!data?.calendly_url) {
      throw new Error('No Calendly URL found in response');
    }

    return new Response(
      JSON.stringify({ calendly_url: data.calendly_url }),
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