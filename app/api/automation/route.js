import axios from "axios";

const PHANTOM_API_KEY = "qUkLtGWpWT5vn3p8vIDEIlxlSVc4tvCKvxX5GQ4pTsE";
const COMMENTER_PHANTOM_ID = "2890385388019000";
const SCRAPER_PHANTOM_ID = "6817860463727591";

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, postUrl, dmMessage, profileUrls } = body;

    // Action 1: Collect commenters from a LinkedIn post
    if (action === "collect_commenters") {
      const response = await axios.post(
        "https://api.phantombuster.com/api/v2/agents/launch",
        {
          id: COMMENTER_PHANTOM_ID,
          argument: {
            postUrl: postUrl,
            numberOfCommentsPerLaunch: 50,
          },
        },
        {
          headers: {
            "X-Phantombuster-Key": PHANTOM_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      return Response.json({
        success: true,
        message: "Collecting commenters started",
        containerId: response.data.containerId,
      });
    }

    // Action 2: Scrape commenters and leads from a post
    if (action === "scrape_post") {
      const response = await axios.post(
        "https://api.phantombuster.com/api/v2/agents/launch",
        {
          id: SCRAPER_PHANTOM_ID,
          argument: {
            postUrl: postUrl,
            numberOfCommentsPerLaunch: 50,
          },
        },
        {
          headers: {
            "X-Phantombuster-Key": PHANTOM_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      return Response.json({
        success: true,
        message: "Scraping post started",
        containerId: response.data.containerId,
      });
    }

    // Action 3: Get results from a phantom run
    if (action === "get_results") {
      const { containerId } = body;
      const response = await axios.get(
        `https://api.phantombuster.com/api/v2/containers/fetch-result-object?id=${containerId}`,
        {
          headers: {
            "X-Phantombuster-Key": PHANTOM_API_KEY,
          },
        }
      );

      return Response.json({
        success: true,
        results: response.data,
      });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Automation error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// GET endpoint to check automation status
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const containerId = searchParams.get("containerId");

  if (!containerId) {
    return Response.json({ error: "containerId required" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://api.phantombuster.com/api/v2/containers/fetch-output?id=${containerId}`,
      {
        headers: {
          "X-Phantombuster-Key": PHANTOM_API_KEY,
        },
      }
    );

    return Response.json({
      success: true,
      status: response.data.status,
      output: response.data.output,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
