import "./App.css";
import { useState, useEffect, useRef } from "react";
import { getEngineForPrompt } from "./proccesor";
import { generateImage } from "../generateImage.js";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import DownloadButton from "./download.jsx";
import DisclaimerModal from "../disclaimer.jsx";
import UsernameModal from "./Username.jsx";
import PlansModal from "./plans.jsx";
import UsageTracker from "./UsageTracker.jsx";
import PlanBadge from "./PlanBadge.jsx";
import CancelConfirmModal from "./confirm.jsx";
import FeedbackModal from "./Feedback.jsx";
import Confirm from "./secConfirm.jsx";
import AdminPasswordModal from "./Admin.jsx";
import ModelSwitchModal from "./switch.jsx";
import { staticImages, adminImages } from "./statics.js";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [userGeneratedImages, setUserGeneratedImages] = useState([]);
  const manualTimeoutRef = useRef(null);
  const [plan, setPlan] = useState("free");
  const [showPlans, setShowPlans] = useState(false);
  const [refreshUsage, setRefreshUsage] = useState(0);
  const [isPlus, setIsPlus] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPayg, setIsPayg] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSec, setShowSec] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [passField, setShowPassField] = useState(false);
  const [modal, setShowModal] = useState(false);
  const [model, setModel] = useState();
  const [free, setFree] = useState(true);
  const [display, setDisplay] = useState("NSFW Model aisha");
  const [active, setActive] = useState(false);
  const plansRef = useRef();
  const [adminMode, setAdminMode] = useState(() => {
    return localStorage.getItem("adminMode") === "true";
  });

  const images = [...userGeneratedImages, ...staticImages];
  const replaceImages = [...userGeneratedImages, ...adminImages];

  const activeImages = adminMode ? replaceImages : images;

  const username = sessionStorage.getItem("username");

  useEffect(() => {
    if (isManual) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === activeImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [activeImages.length, isManual]);

  useEffect(() => {
    const current = sessionStorage.getItem("plan") || "free";
    setPlan(current);
  }, []);

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    if (!username) return;

    const fetchPlan = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/username/${username}`);
        const data = await res.json();
        if (res.ok && data.user?.plan) {
          setPlan(data.user.plan);
        }
      } catch (err) {
        console.error("Failed to fetch plan:", err);
      }
    };

    fetchPlan();
  }, []);

  useEffect(() => {
    setIsPremium(plan === "premium");
    setIsPlus(plan === "plus");
    setIsPayg(plan === "payg");
  }, [plan]);

  useEffect(() => {
    console.log("plansRef.current is:", plansRef.current);
  }, [showPlans]);

  useEffect(() => {
    if (adminMode) {
      setIsPremium(false);
      setIsPlus(false);
      setIsPayg(false);
    }
  }, [adminMode]);

  const handleExternalCancel = () => {
    console.log("Handel External Initiated!");
    if (plansRef.current) {
      console.log(plansRef.current);
      plansRef.current.triggerCancel();
      setShowPlans(false);
    }
  };

  const handleExternalCheckout = (selectedPlan) => {
    console.log("Handle External Checkout Initiated!");
    if (plansRef.current) {
      console.log("Checkout Plan:", selectedPlan);
      plansRef.current.triggerCheckout(selectedPlan);
      setShowPlans(false); // Optional: hide modal after triggering
    }
  };

  const evaluate = async (prompt) => {
    console.log("Evaluation Triggered");
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    if (data.adminTrigger === true) {
      console.log("Admin Phrase Detected!");
      setShowPassField(true);
      return true;
    }
    return false;
  };

  const select = async (model) => {
    console.log("Select evaluating");
    if (model === "sfw") {
      setModel("photonFlash");
      setDisplay("PhotonFlash SFW");
      if (!free) {
        setFree(true);
      }
      toast.success("Switched to SFW Model PhotonFlash!", {
        duration: 4000,
      });
    } else if (model === "free") {
      setFree(false);
      setDisplay(" Free Stable Horde");
      toast.success("Switched to free Model Stable Horde", {
        duration: 4000,
      });
    } else {
      setModel(null);
      setDisplay("Illustrious & RealisticVision NSFW");
      if (!free) {
        setFree(true);
      }
      toast.success("NSFW models Illustrious and RealisitcVision are in use!", {
        duration: 4000,
      });
    }
  };

  const handlePremiumGenerate = async () => {
    const check = await evaluate(prompt);
    if (check) return;

    console.log("Premium Generation Triggered!");

    const username = sessionStorage.getItem("username");
    const admin = adminMode;

    if (!username) {
      alert("Username not found.");
      setLoading(false);
      setIsGenerating(false);
      return;
    }

    try {
      const usageRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, admin }),
      });

      const usageData = await usageRes.json();
      console.log(usageData);

      if (!usageData.allowed) {
        toast.error(usageData.reason || "Daily limit reached.");
        setLoading(false);
        setIsGenerating(false);
        return;
      }
    } catch (err) {
      console.error("Usage check failed:", err);
      alert("Failed to check usage. Try again.");
      setLoading(false);
      setIsGenerating(false);
      return;
    }

    if (!prompt.trim()) return;

    setImageUrl(null);
    setLoading(true);
    setIsGenerating(true);

    console.log("Premium generation started with prompt:", prompt);

    try {
      const selectedModel = model || getEngineForPrompt(prompt);
      console.log("Selected model:", selectedModel);

      const url = await generateImage({ prompt, model: selectedModel });
      console.log("✅ Image URL:", url);

      setImageUrl(url);
      setUserGeneratedImages((prev) => [...prev, url]);

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usage/increment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      setTimeout(() => {
        setRefreshUsage((prev) => prev + 1);
      }, 300);
    } catch (e) {
      console.error("❌ Premium generation failed:", e);
      alert("Something went wrong during premium generation.");
    }

    setLoading(false);
    setIsGenerating(false);
  };

  const handleGenerate = async () => {
    const check = await evaluate(prompt);
    if (check) return;

    console.log("Handle Generate Triggered!");

    const admin = adminMode;

    const username = sessionStorage.getItem("username");
    if (!username) {
      alert("Username not found.");
      setLoading(false);
      setIsGenerating(false);
      return;
    }

    try {
      const usageRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, admin }),
      });

      const usageData = await usageRes.json();
      console.log(usageData);

      if (!usageData.allowed) {
        toast.error(usageData.reason || "Daily limit reached.");
        setLoading(false);
        setIsGenerating(false);
        return;
      }
    } catch (err) {
      console.error("Usage check failed:", err);
      alert("Failed to check usage. Try again.");
      setLoading(false);
      setIsGenerating(false);
      return;
    }

    setLoading(true);
    setIsGenerating(true);

    if (!prompt.trim()) {
      setLoading(false);
      setIsGenerating(false);
      return;
    }

    setImageUrl(null);

    try {
      const requestRes = await fetch(
        "https://stablehorde.net/api/v2/generate/async",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_HORDE_API_KEY || "0000000000",
          },
          body: JSON.stringify({
            prompt,
            nsfw: true,
            censor_nsfw: false,
            width: 512,
            height: 512,
            steps: 25,
            cfg_scale: 8,
            sampler_name: "k_euler_ancestral",
            models: ["Deliberate", "Realistic Vision V5"],
          }),
        }
      );

      const responseJson = await requestRes.json();
      const id = responseJson.id;

      if (!id) {
        console.error("Generation request failed:", responseJson);
        alert("Generation failed. Try again.");
        setLoading(false);
        setIsGenerating(false);
        return;
      }

      let imageGenerated = false;
      let image = null;

      while (!imageGenerated) {
        const checkRes = await fetch(
          `https://stablehorde.net/api/v2/generate/status/${id}`
        );
        const checkData = await checkRes.json();

        if (checkData.done) {
          image = checkData.generations?.[0]?.img;
          imageGenerated = true;
        } else {
          await new Promise((res) => setTimeout(res, 3000));
        }
      }

      if (image) {
        setImageUrl(image);

        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usage/increment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        setTimeout(() => {
          setRefreshUsage((prev) => prev + 1);
        }, 300);
      } else {
        toast.error("No Image Returned!");
      }
    } catch (err) {
      console.error("Generation error:", err);
      alert("Image generation failed.");
    }

    setLoading(false);
    setIsGenerating(false);
  };

  const handleManualNavigation = (direction) => {
    setIsManual(true);

    if (manualTimeoutRef.current) {
      clearTimeout(manualTimeoutRef.current);
    }

    manualTimeoutRef.current = setTimeout(() => {
      setIsManual(false);
    }, 5000); // Resume auto-scroll after 5s

    setCurrentIndex((prev) => {
      if (direction === "left") {
        return prev === 0 ? images.length - 1 : prev - 1;
      } else {
        return prev === images.length - 1 ? 0 : prev + 1;
      }
    });
  };

  return (
    <>
      <UsernameModal
        onSetUsername={(u) => {
          console.log("Username set:", u);
          toast.success("Username set!");
        }}
        onSuccess={() => setShowPassField(true)}
      />
      <DisclaimerModal />
      <div className="container py-5 containing">
        <Toaster />

        {(isGenerating || imageUrl) && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 9999,
            }}
          >
            <div
              className="bg-dark rounded shadow p-4 d-flex flex-column align-items-center"
              style={{
                width: "auto",
                maxWidth: "90vw",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/*Carousel if generating */}
              {isGenerating && (
                <>
                  <div className="carousel-viewport mb-3">
                    <div
                      className="carousel-slider"
                      style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                      }}
                    >
                      {activeImages.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`AI ${index + 1}`}
                          className="carousel-image"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2">✨ Generating your desire...</p>
                </>
              )}

              {/*Editing text area*/}
              {isEditingPrompt && (
                <div className="w-100 mb-3">
                  <textarea
                    className="form-control form-control-lg border border-pink rounded p-3"
                    rows="4"
                    style={{
                      resize: "none",
                      borderColor: "#ff69b4",
                      fontSize: "1.2rem",
                    }}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="d-flex justify-content-center mt-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setIsEditingPrompt(false);
                        ((adminMode && free) || isPremium || isPlus || isPayg
                          ? handlePremiumGenerate
                          : handleGenerate)();
                      }}
                    >
                      Generate
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setIsEditingPrompt(false)}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/*Final Image if done */}
              {!isGenerating && imageUrl && (
                <>
                  <img
                    src={imageUrl}
                    alt="Result"
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: "70vh" }}
                  />
                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setIsEditingPrompt(true)}
                    >
                      Edit Prompt
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        ((adminMode && free) || isPremium || isPlus || isPayg
                          ? handlePremiumGenerate
                          : handleGenerate)()
                      }
                    >
                      Retry
                    </button>

                    {(adminMode || isPremium || isPlus || isPayg) &&
                      imageUrl && <DownloadButton imageUrl={imageUrl} />}
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => {
                        setImageUrl(null);
                        setPrompt("");
                      }}
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/**Feedback feild */}
        {showFeedback && (
          <FeedbackModal
            username={username}
            onClose={() => setShowFeedback(false)}
          />
        )}

        {/**Switch Model conditional */}
        {modal && (
          <ModelSwitchModal
            onConfirm={(selectedModel) => {
              setShowModal(false);
              select(selectedModel);
            }}
            onClose={() => setShowModal(false)}
          />
        )}

        {showPlans && (
          <PlansModal
            ref={plansRef}
            onClose={() => setShowPlans(false)}
            showtheConfirm={() => setShowConfirm(true)}
            onCancelSuccess={() => setShowConfirm(false)}
            onClickSuccess={(plan) => {
              setSelectedPlan(plan);
              setShowSec(true);
            }}
          />
        )}

        {passField && (
          <AdminPasswordModal
            onSuccess={() => {
              setPrompt("");
              setAdminMode(true);
              localStorage.setItem("adminMode", "true");
              setShowPassField(false);
              toast.success("Admin Mode Activated, Welcome Back Joshua✨", {
                duration: 5000,
              });
            }}
            onClose={() => setShowPassField(false)}
            onFailure={() => {
              setShowPassField(false);
              toast.error("Incorrect Password!");
            }}
          />
        )}
        {showSec && (
          <Confirm
            plan={selectedPlan}
            onConfirm={() => {
              setShowSec(false);
              handleExternalCheckout(selectedPlan);
            }}
            onCancel={() => setShowSec(false)}
          />
        )}
        {showConfirm && (
          <CancelConfirmModal
            plan={plan}
            onConfirm={handleExternalCancel}
            onClose={() => setShowConfirm(false)}
          />
        )}

        <div className="heading-stuff">
          {adminMode && (
            <h1 className="text-center mb-3">
              ✨AI Gen✨
              <PlanBadge plan={plan} admin={adminMode} />
            </h1>
          )}
          {!adminMode && (
            <h1 className="text-center mb-3">
              🩷InYourDreams🩷
              <PlanBadge plan={plan} admin={adminMode} />
            </h1>
          )}
          <UsageTracker
            username={username}
            triggerRefresh={refreshUsage}
            admin={adminMode}
            model={display}
          />
          {((adminMode && active) || isPremium) && (
            <Link to="/gallery" className="btn btn-outline-secondary search">
              search gallery
              <i className="bi bi-search-heart"></i>
            </Link>
          )}
          {adminMode && (
            <button
              className="btn btn-outline-secondary w-auto"
              onClick={() => setActive((prev) => !prev)}
            >
              {active ? "h" : "g"}
            </button>
          )}
        </div>
        <div className="heading-stuff">
          {adminMode && (
            <p className="text-center mb-4">
              Welcome Joshua, Generate Anything You desire✨
            </p>
          )}
          {!adminMode && (
            <p className="text-center mb-4">
              Generate your most perfect dream girl😏🩷
            </p>
          )}
        </div>

        <div className="mb-3">
          <textarea
            className="form-control form-control-lg border border-pink rounded p-3"
            rows="4"
            style={{
              resize: "none",
              borderColor: "#ff69b4",
              fontSize: "1.2rem",
            }}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              adminMode
                ? "A grunge band with oversized t-shirts, high quality"
                : "A cute girl, long blonde hair, sexy outfit"
            }
          />
        </div>

        <div className="d-flex gap-3 mb-4 justify-content-center">
          <button
            className="btn"
            style={{ backgroundColor: "#ff69b4", color: "white" }}
            onClick={() => {
              if (isEditingPrompt) {
                setIsEditingPrompt(false);
              }
              ((adminMode && free) || isPremium || isPlus || isPayg
                ? handlePremiumGenerate
                : handleGenerate)();
            }}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          {adminMode && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowModal(true)}
            >
              Switch AI GEN Models
            </button>
          )}

          <button
            className="btn btn-outline-light mb-3"
            onClick={() => setShowPlans(true)}
          >
            View Plans
          </button>

          {adminMode && (
            <button
              className="btn btn-outline-danger w-30"
              onClick={() => {
                setAdminMode(false);
                localStorage.removeItem("adminMode");
                toast.success("Admin Mode Disabled");
              }}
            >
              Exit Admin Mode
            </button>
          )}
        </div>

        {/*Courosel code, soon to be a component*/}
        <div className="custom-carousel carousel slide">
          <button
            className="carousel-btn left"
            onClick={() => handleManualNavigation("left")}
          >
            ◀
          </button>

          {/*Viewport wrapper*/}
          <div className="carousel-viewport">
            <div
              className="carousel-slider"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {activeImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`AI ${index + 1}`}
                  className="carousel-image"
                />
              ))}
            </div>
          </div>
          {/* ☝️ END viewport wrapper */}

          <button
            className="carousel-btn right"
            onClick={() => handleManualNavigation("right")}
          >
            ▶
          </button>
          {!adminMode && (
            <div className="landing">
              <h3>
                Generate AI girls or anything you desire for free or for a much
                better experience, with a plan that fits your needs✨
              </h3>
            </div>
          )}
          {adminMode && (
            <div className="landing">
              <h3>
                Admin Mode On, Generate anything you desire and switch models
                based on your prefrences!😎✨
              </h3>
            </div>
          )}
        </div>
        <div className="d-flex flex-column justify-content-start m-3">
          <div className="d-flex gap-3 align-items-center p-3">
            <Link to="/legal" className="btn btn-outline-secondary">
              Terms of Service and Privacy Policy
            </Link>
            <button
              className="btn btn-outline-success"
              onClick={() => {
                setShowFeedback(true);
              }}
            >
              Provide Feedback
            </button>
          </div>
          <small className="d-flex justify-content-start ps-3">
            Please Provide Feedback for a permanent limit increase of 5 and it
            will be very much appereciated as well✨
          </small>
        </div>
      </div>
    </>
  );
}

export default App;
