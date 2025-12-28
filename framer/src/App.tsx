import React, { useState, useEffect, useRef } from 'react';


export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Normalize mouse position to -1 to 1 range
            const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
            const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));
            
            setMousePosition({ x, y });
          }
        });
      }
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Calculate rotation based on mouse position
  const baseRotateX = 18;
  const baseRotateY = -18;
  const maxRotation = 12; // Maximum rotation in degrees
  
  const rotateX = baseRotateX + (mousePosition.y * maxRotation);
  const rotateY = baseRotateY + (mousePosition.x * maxRotation);

  return ( <div className="text-black text-[16px] leading-[normal]" style={{"fontFamily":"\"Times New Roman\"","width":"1440px","transform":"scale(1)","margin":"auto"}}>
  <div className="bg-black text-[12px]" style={{"fontFamily":"sans-serif"}}>
    <div>
      <div className="items-center flex flex-col h-min justify-center overflow-clip relative bg-black gap-[136px] min-h-[900px] pt-12 pr-0 pb-0 pl-0">
        <div aria-label="Main" className="items-center flex flex-col h-screen justify-center relative w-[1200px] gap-[0px] shrink-[0]">
          <div aria-label="Center text" className="items-center flex flex-col h-min justify-center overflow-hidden pointer-events-none absolute w-[1160px] left-[50%] top-[50%] gap-[20px] translate-x-[-50%] translate-y-[-50%] z-[1] shrink-[0]">
            <div aria-label="Title" className="flex flex-col justify-start pointer-events-none relative whitespace-pre-wrap w-full max-w-[408px] shrink-[0]">
              <p className="font-semibold pointer-events-none text-center text-white text-[37px] leading-[44.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Hello there, I'm a</p>
              <p className="font-semibold pointer-events-none text-center text-white text-[37px] leading-[44.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>designer who cares</p>
              <p className="font-semibold pointer-events-none text-center text-white text-[37px] leading-[44.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>about making</p>
              <p className="font-semibold pointer-events-none text-center text-white text-[37px] leading-[44.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>beautiful things that</p>
              <p className="font-semibold pointer-events-none text-center text-white text-[37px] leading-[44.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>help people.</p>
            </div>
          </div>
          <div className="relative shrink-[0]" ref={containerRef}>
            <div style={{
              transform: `perspective(500px) rotate3d(1, 0, 0, ${rotateX}deg) rotate3d(0, 1, 0, ${rotateY}deg)`,
              transition: isHovering ? 'none' : 'transform 0.5s ease-out'
            }}>
              <div aria-label="Images 3D" className="items-center flex justify-center relative w-[1109px] h-[1006px] gap-[10px]">
                <div aria-label="Content" className="items-center flex grow h-full justify-center relative w-px basis-0 gap-[10px] shrink-[0]">
                  <div className="absolute right-[52px] bottom-[55px] rotate-19 z-[1] shrink-[0]">
                    <div aria-label="Variant 1" className="items-center flex flex-col size-min justify-center relative gap-[10px]">
                      <a aria-label="8" className="block relative w-[140px] h-[180px] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbcdd7257f7a4c9f8e190bb1e7892f1002c430da6.png?generation=1763130269887677&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_733_/_1024] rounded-[0.625rem]" />
                        </div>
                      </a>
                      <div className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="font-light text-center text-white leading-[14.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Dynamic Animations</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute right-[168px] bottom-[129px] rotate-11 z-[1] shrink-[0]">
                    <div aria-label="Variant 1" className="items-center flex flex-col size-min justify-center relative gap-[10px]">
                      <a aria-label="7" className="block relative w-[136px] h-[136px] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F2085435f1961e80a56a740d795be81458e9cc790.jpeg%3Fscale-down-to=512?generation=1763130269876681&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_1200_/_1200] rounded-[0.625rem]" />
                        </div>
                      </a>
                      <div aria-label="Lighted key" className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="text-center text-white leading-[14.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Case Studies</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-[51%] right-[10px] translate-y-[-50%] z-[1] shrink-[0]">
                    <a aria-label="Variant 1" className="items-center flex flex-col size-min justify-center relative gap-[10px]">
                      <div aria-label="5" className="relative w-[140px] h-[190px] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fdbefd5863b400ffad7c2379c16515e1430229ea1.png?generation=1763130269918752&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_819_/_1024] rounded-[0.625rem]" />
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="font-light text-center text-white leading-[14.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Brand Identity</p>
                      </div>
                    </a>
                  </div>
                  <div className="absolute left-[52%] bottom-5 translate-x-[-50%] z-[1] shrink-[0]">
                    <a aria-label="Variant 1" className="items-center flex flex-col size-min justify-center relative gap-[10px]">
                      <div aria-label="6" className="relative w-[140px] aspect-[0.730539_/_1] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5f715fb86e3a4c4c5994b436e86fe48db7300198.png?generation=1763130269910421&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_682_/_1024] rounded-[0.625rem]" />
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="font-light text-center text-white leading-[14.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>UI/UX Solutions</p>
                      </div>
                    </a>
                  </div>
                  <div className="absolute left-[42px] bottom-[75px] -rotate-19 z-[1] shrink-[0]">
                    <a aria-label="Variant 1" className="items-center flex flex-col size-min justify-center relative gap-[10px]">
                      <div aria-label="10" className="relative w-[200px] h-[190px] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F481a25e2ec63dd18427e0032048c6aa26ffc83c7.jpeg%3Fscale-down-to=1024?generation=1763130269901671&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_1200_/_1500] rounded-[0.625rem]" />
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="text-center text-white leading-[14.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>User-Centered Design</p>
                      </div>
                    </a>
                  </div>
                  <div className="absolute left-0 top-[50%] translate-y-[-50%] z-[1] shrink-[0]">
                    <a aria-label="Variant 1" className="items-center flex flex-col size-min justify-center relative gap-[10px]">
                      <div aria-label="9" className="relative w-[130px] h-[162px] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F7c47025028a338f90278800e036067402bea8100.png?generation=1763130269895367&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_829_/_1024] rounded-[0.625rem]" />
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="text-center text-white leading-[14.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Mobile App</p>
                      </div>
                    </a>
                  </div>
                  <div className="absolute left-[51%] top-[29px] translate-x-[-50%] z-[1] shrink-[0]">
                    <a aria-label="Variant 1" className="items-center flex flex-col size-min justify-center relative gap-[10px]">
                      <div aria-label="3" className="relative w-[130px] h-[190px] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F76c87d97ab3d1f4683258d0dfff37f464e758555.png%3Fwidth=684&amp;height=1024?generation=1763130269909095&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_684_/_1024] rounded-[0.625rem]" />
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="font-light text-center text-white leading-[14.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Interactive Prototypes</p>
                      </div>
                    </a>
                  </div>
                  <div className="absolute left-[45px] top-[67px] rotate-19 z-[1] shrink-[0]">
                    <a aria-label="Variant 1" className="items-center flex flex-col size-min justify-center relative gap-[10px]">
                      <div aria-label="1" className="relative w-60 h-[190px] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F0d80f94500cb1e7e2eb2d0ff446a537d3d989f9f.png?generation=1763130269791467&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_683_/_1024] rounded-[0.625rem]" />
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="text-center text-white leading-[14.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Creative Storytelling</p>
                      </div>
                    </a>
                  </div>
                  <div className="absolute top-[58px] right-[41px] -rotate-19 z-[1] shrink-[0]">
                    <a aria-label="Default" className="items-center flex flex-col size-min justify-center relative gap-[12px]">
                      <div aria-label="4" className="relative w-[280px] h-[210px] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fef4702e5dfcd0d08ce00c3f8d7e494aba19cc549.png?generation=1763130269918778&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_819_/_1024] rounded-[0.625rem]" />
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="text-center text-white tracking-[-0.12px] leading-[18px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Web Design Highlights</p>
                      </div>
                    </a>
                  </div>
                  <div className="absolute left-[279px] top-[170px] rotate-11 z-[1] shrink-[0]">
                    <a aria-label="Default" className="items-center flex flex-col size-min justify-center relative gap-[10px]">
                      <div aria-label="2" className="relative w-[104px] h-[125px] z-[1] shrink-[0] rounded-[0.625rem]">
                        <div className="absolute left-0 top-0 right-0 bottom-0 rounded-[0.625rem]">
                          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa147779be330c26708373f77c85bcec109677bf2.jpeg%3Fscale-down-to=512?generation=1763130269869569&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_1200_/_1200] rounded-[0.625rem]" />
                        </div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start relative whitespace-pre-wrap shrink-[0]">
                        <p className="text-center text-white leading-[14.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Microinteractions</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div aria-label="Spacer" className="items-center flex justify-center overflow-clip relative w-full h-[383.976px] gap-[10px] shrink-[0]"></div>
        <div aria-label="Scroll Animation Container" className="items-center flex flex-col h-min justify-start overflow-clip relative w-full gap-[0px] shrink-[0]">
          <div aria-label="Sticky" className="items-center flex h-screen justify-center overflow-clip sticky w-full top-0 gap-[10px] z-[1] shrink-[0]">
            <div aria-label="Content" className="items-center flex flex-col grow h-full justify-center relative w-px basis-0 gap-[10px] z-[3] shrink-[0]" style={{"transform":"perspective(1000px)"}}>
              <div className="contents">
                <div className="relative w-[36%] max-w-[500px]">
                  <a href="https://left-page-950432.framer.app/new-case-study/unduit" aria-label="4" className="items-center flex flex-col h-min justify-center max-w-full overflow-clip relative w-full text-[rgb(0,_0,_238)] gap-[0px]" style={{"textDecoration":"rgb(0, 0, 238)"}}>
                    <div aria-label="4" className="relative w-full aspect-[1.32565_/_1] shrink-[0]" style={{"transform":"rotate3d(1, 0, 0, 180deg)"}}>
                      <div aria-label="Default" className="items-center flex flex-col size-full justify-center overflow-clip relative gap-[10px] rounded-[0.875rem]">
                        <div aria-label="Icon Holder" className="aspect-square mix-blend-difference overflow-clip absolute w-6 top-4 right-4 z-[4] shrink-[0]">
                          <div role="presentation" className="aspect-square mix-blend-difference overflow-hidden absolute w-6 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F00a27217ac320d873f3928396e477efa54a19c25.svg?generation=1763130269955304&amp;alt=media" className="block size-full" />
                          </div>
                          <div role="presentation" className="aspect-square mix-blend-difference overflow-hidden absolute w-6 left-[-20px] bottom-[-20px]">
                            <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4c60731776bca44b1bf099662caf52a435aa4f3d.svg?generation=1763130270055288&amp;alt=media" className="block size-full" />
                          </div>
                        </div>
                        <div aria-label="Content" className="items-start flex flex-col grow h-px justify-end overflow-clip relative w-full basis-0 gap-[10px] p-4 z-[4] shrink-[0]">
                          <div aria-label="Row" className="items-center flex h-min justify-center overflow-clip relative w-full invert-[0] gap-[10px] shrink-[0]">
                            <div className="flex flex-col grow justify-start relative whitespace-pre-wrap w-px basis-0 shrink-[0]">
                              <p className="font-semibold text-white text-[24px] tracking-[-0.48px] leading-[28.8px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Agile By Design</p>
                            </div>
                            <div aria-label="Tags" className="items-center flex size-min justify-center overflow-clip relative gap-[8px] shrink-[0]">
                              <div aria-label="Tag" className="items-center flex size-min justify-center overflow-clip relative bg-white gap-[10px] pt-[3px] pr-[5px] pb-[3px] pl-[5px] shrink-[0] rounded-md">
                                <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                                  <p className="font-semibold text-black text-[14px] tracking-[-0.28px] leading-[16.8px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif"}}>Branding</p>
                                </div>
                              </div>
                              <div aria-label="Tag" className="items-center flex size-min justify-center overflow-clip relative bg-white gap-[10px] pt-[3px] pr-[5px] pb-[3px] pl-[5px] shrink-[0] rounded-md">
                                <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                                  <p className="font-semibold text-black text-[14px] tracking-[-0.28px] leading-[16.8px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif"}}>Design</p>
                                </div>
                              </div>
                              <div aria-label="Tag" className="items-center flex size-min justify-center overflow-clip relative bg-white gap-[10px] pt-[3px] pr-[5px] pb-[3px] pl-[5px] shrink-[0] rounded-md">
                                <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                                  <p className="font-semibold text-black text-[14px] tracking-[-0.28px] leading-[16.8px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif"}}>Development</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-0 top-0 right-0 bottom-0 scale-[1.15_1.15] z-[1] shrink-[0]">
                          <video src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F723e2aad69d528214031e44317a1b15fcb0f70c1.png%3Fwidth=1600&amp;height=1200?generation=1763130270034069&amp;alt=media" className="size-full object-cover overflow-clip"></video>
                        </div>
                        <div aria-label="Dark Bottom Overlay" className="overflow-clip absolute h-[60%] left-0 right-0 bottom-0 bg-[rgb(5,_5,_5)] z-[1] shrink-[0]"></div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div aria-label="Text Stripe" className="items-center flex flex-col justify-start overflow-clip absolute h-[120px] left-0 top-[calc(50%-60px)] right-0 gap-[0px] z-[0] shrink-[0]">
              <div aria-label="Lined Up" className="items-center flex flex-col h-min justify-start overflow-clip relative w-full gap-[120px] shrink-[0]">
                <div className="contents">
                  <div className="relative w-full">
                    <div aria-label="Defa" className="items-center flex justify-center relative w-full h-[120px] gap-[10px]">
                      <div className="grow h-full relative w-px basis-0 shrink-[0]">
                        <section className="items-center flex size-full justify-items-center max-h-full max-w-full overflow-hidden p-[10px]">
                          <ul className="items-center flex size-full justify-items-center max-h-full max-w-full relative gap-[100px]">
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Unduit</p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Unduit</p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Unduit</p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contents">
                  <div className="relative w-full">
                    <div aria-label="Defa" className="items-center flex justify-center relative w-full h-[120px] gap-[10px]">
                      <div className="grow h-full relative w-px basis-0 shrink-[0]">
                        <section className="items-center flex size-full justify-items-center max-h-full max-w-full overflow-hidden p-[10px]">
                          <ul className="items-center flex size-full justify-items-center max-h-full max-w-full relative gap-[100px]">
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Helix Biostructures</p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contents">
                  <div className="relative w-full">
                    <div aria-label="Defa" className="items-center flex justify-center relative w-full h-[120px] gap-[10px]">
                      <div className="grow h-full relative w-px basis-0 shrink-[0]">
                        <section className="items-center flex size-full justify-items-center max-h-full max-w-full overflow-hidden p-[10px]">
                          <ul className="items-center flex size-full justify-items-center max-h-full max-w-full relative gap-[100px]">
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Givingli</p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Givingli</p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Givingli</p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contents">
                  <div className="relative w-full">
                    <div aria-label="Defa" className="items-center flex justify-center relative w-full h-[120px] gap-[10px]">
                      <div className="grow h-full relative w-px basis-0 shrink-[0]">
                        <section className="items-center flex size-full justify-items-center max-h-full max-w-full overflow-hidden p-[10px]">
                          <ul className="items-center flex size-full justify-items-center max-h-full max-w-full relative gap-[100px]">
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Agile By Design</p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Agile By Design</p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                            <li className="list-none text-left">
                              <div aria-label="Text" className="items-center flex size-min justify-center relative text-left gap-[10px]">
                                <div className="flex flex-col justify-start relative text-left whitespace-pre shrink-[0]">
                                  <p className="font-bold uppercase text-white text-[126px] tracking-[-3.78px] leading-[151.2px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}></p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div aria-label="Spacer" className="overflow-clip relative w-full h-[585px] shrink-[0]"></div>
          <div aria-label="Out 1" className="overflow-clip relative w-full h-[225px] shrink-[0]"></div>
          <div aria-label="Swtich 2" className="h-px overflow-clip relative w-full shrink-[0]"></div>
          <div aria-label="In 2" className="overflow-clip relative w-full h-[225px] shrink-[0]"></div>
          <div aria-label="Spacer" className="overflow-clip relative w-full h-[585px] shrink-[0]"></div>
          <div aria-label="Out 2" className="overflow-clip relative w-full h-[225px] shrink-[0]"></div>
          <div aria-label="Swtich 3" className="h-px overflow-clip relative w-full shrink-[0]"></div>
          <div aria-label="In 3" className="overflow-clip relative w-full h-[225px] shrink-[0]"></div>
          <div aria-label="Spacer" className="overflow-clip relative w-full h-[585px] shrink-[0]"></div>
          <div aria-label="Out 3" className="overflow-clip relative w-full h-[225px] shrink-[0]"></div>
          <div aria-label="Swtich 4" className="h-px overflow-clip relative w-full shrink-[0]"></div>
          <div aria-label="In 4" className="overflow-clip relative w-full h-[225px] shrink-[0]"></div>
          <div aria-label="Spacer" className="overflow-clip relative w-full h-[585px] shrink-[0]"></div>
        </div>
        <section aria-label="Hero" className="items-center flex flex-col h-min justify-center overflow-hidden relative w-[1300px] gap-[70px] pt-40 pr-20 pb-[100px] pl-20 shrink-[0]">
          <div aria-label="Container" className="items-center flex flex-col h-min justify-center relative w-full gap-[44px] shrink-[0]">
            <div aria-label="Heading" className="items-center flex flex-col h-min justify-center relative w-full gap-[64px] max-w-[1200px] p-10 z-[3] shrink-[0]">
              <div className="items-center flex h-min justify-center overflow-hidden relative w-[716px] gap-[10px] shrink-[0]">
                <div aria-label="Text Content" className="items-center flex flex-col h-min justify-center relative w-full gap-[16px] shrink-[0]">
                  <div aria-label="Text &amp; Images" className="items-center flex flex-col size-min justify-center relative gap-[20px] shrink-[0]">
                    <div className="items-center flex flex-col size-min justify-center overflow-hidden relative gap-[10px] shrink-[0]">
                      <div className="items-center flex size-min justify-center overflow-hidden relative gap-[32px] shrink-[0]">
                        <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                          <h1 className="text-center text-white text-[38px] leading-[49.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>I design experiences that are</h1>
                        </div>
                        <div className="relative shrink-[0]">
                          <span className="inline-block whitespace-pre w-max text-white text-[32px] tracking-[-0.32px] leading-[38.4px] min-w-8" style={{"fontFamily":"\"Edu QLD Hand\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>user-first<span className="opacity-[0.7]">|</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start relative whitespace-pre-wrap w-[716px] shrink-[0] opacity-[0.7]">
                    <p className="text-center text-white text-[16px] leading-[24px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Fashion marketeer turned product designer; I bring a sharp eye and strategic thinking to craft   digital products that feel effortless, scale with intention, and make users stay.</p>
                  </div>
                </div>
              </div>
              <div aria-label="Cta" className="items-center flex size-min justify-start relative gap-[16.93px] shrink-[0]">
                <div className="contents">
                  <div className="relative">
                    <a href="https://framer.link/CdWbswo" aria-label="Primary Cta" className="items-center flex size-min justify-center overflow-hidden relative shadow-[rgba(61,61,61,0.72)_0px_0.602187px_1.08394px_-1.25px,_rgba(61,61,61,0.64)_0px_2.28853px_4.11936px_-2.5px,_rgba(61,61,61,0.25)_0px_10px_18px_-3.75px,_rgba(0,0,0,0.35)_0px_0.706592px_0.706592px_-0.583333px,_rgba(0,0,0,0.34)_0px_1.80656px_1.80656px_-1.16667px,_rgba(0,0,0,0.33)_0px_3.62176px_3.62176px_-1.75px,_rgba(0,0,0,0.3)_0px_6.8656px_6.8656px_-2.33333px,_rgba(0,0,0,0.26)_0px_13.6468px_13.6468px_-2.91667px,_rgba(0,0,0,0.15)_0px_30px_30px_-3.5px] text-[rgb(0,_0,_238)] gap-[8px] pt-3 pr-[26px] pb-3 pl-[26px] rounded-[62.5rem] after:border after:size-full after:pointer-events-none after:absolute after:left-0 after:top-0 after:border-neutral-900 after:content-[&quot;&quot;] after:rounded-[62.5rem]" style={{"backgroundImage":"linear-gradient(rgba(173, 173, 173, 0.15) 0%, rgb(0, 0, 0) 17.436%)","textDecoration":"rgb(0, 0, 238)"}}>
                      <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                        <p className="font-medium text-white text-[14px] leading-[22.4px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Get In Touch Today</p>
                      </div>
                      <div className="relative w-5 h-5 shrink-[0]">
                        <div className="contents"></div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative w-[1200px] h-[117px] scale-[0.9_0.9] shrink-[0]">
                <section className="items-center flex size-full justify-items-center max-h-full max-w-full overflow-hidden p-[10px]">
                  <ul className="items-center flex size-full justify-items-center max-h-full max-w-full relative gap-[68px]">
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Framer" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="framer" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F558f9ac0531fb801fa58454ad5e71ac6db78da41.svg?generation=1763130270050665&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Figma" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="figma" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F727425c7c236190ceedea9935111b55752e40c58.svg?generation=1763130270164553&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Photoshop" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_photoshop" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F2a6272a725e0614b9d8b107b01f826525085f4dc.svg?generation=1763130270074399&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Illustrator" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_illustrator" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fc9c1d2dd8898e229186f0cc7b5a3168600b87807.svg?generation=1763130270149268&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="After Effects" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_after_effects" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]">
                            <div aria-label="bg" className="absolute text-left left-[2px] top-[2px] right-[2px] bottom-[2px]">
                              <div className="size-full text-left">
                                <div className="size-full overflow-hidden text-left">
                                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe1d6f32e484f525db95dee30625a1e5c16bd6c94.svg?generation=1763130270145882&amp;alt=media" className="block size-full" />
                                </div>
                              </div>
                            </div>
                            <div aria-label="Vector" className="absolute text-left left-[6px] top-[10px] right-[6px] bottom-[9px]">
                              <div className="size-full text-left">
                                <div className="size-full overflow-hidden text-left">
                                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F813bb2f53b27d561c5014a2db5e4b5da385249d6.svg?generation=1763130270158331&amp;alt=media" className="block size-full" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Procreate" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="Image" className="absolute text-left w-[74px] left-[-3px] top-[47%] aspect-[1.22277_/_1] translate-y-[-50%] z-[1] shrink-[0]">
                            <div className="absolute text-left left-0 top-0 right-0 bottom-0">
                              <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb56b64eae4bcbada4f15b5d5c553d067b76f8222.png%3Fscale-down-to=512?generation=1763130270149283&amp;alt=media" className="block size-full object-cover overflow-clip text-left aspect-[auto_2503_/_2047]" />
                            </div>
                          </div>
                          <div aria-label="procreate" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]" style={{"order":"11"}}></div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Figma" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="figma" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F727425c7c236190ceedea9935111b55752e40c58.svg?generation=1763130270164553&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Framer" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="framer" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F558f9ac0531fb801fa58454ad5e71ac6db78da41.svg?generation=1763130270050665&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Procreate" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="Image" className="absolute text-left w-[74px] left-[-3px] top-[47%] aspect-[1.22277_/_1] translate-y-[-50%] z-[1] shrink-[0]">
                            <div className="absolute text-left left-0 top-0 right-0 bottom-0">
                              <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb56b64eae4bcbada4f15b5d5c553d067b76f8222.png%3Fscale-down-to=512?generation=1763130270149283&amp;alt=media" className="block size-full object-cover overflow-clip text-left aspect-[auto_2503_/_2047]" />
                            </div>
                          </div>
                          <div aria-label="procreate" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]" style={{"order":"11"}}></div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Framer" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="framer" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F558f9ac0531fb801fa58454ad5e71ac6db78da41.svg?generation=1763130270050665&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Figma" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="figma" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F727425c7c236190ceedea9935111b55752e40c58.svg?generation=1763130270164553&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Photoshop" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_photoshop" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F2a6272a725e0614b9d8b107b01f826525085f4dc.svg?generation=1763130270074399&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Illustrator" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_illustrator" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fc9c1d2dd8898e229186f0cc7b5a3168600b87807.svg?generation=1763130270149268&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="After Effects" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_after_effects" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]">
                            <div aria-label="bg" className="absolute text-left left-[2px] top-[2px] right-[2px] bottom-[2px]">
                              <div className="size-full text-left">
                                <div className="size-full overflow-hidden text-left">
                                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe1d6f32e484f525db95dee30625a1e5c16bd6c94.svg?generation=1763130270145882&amp;alt=media" className="block size-full" />
                                </div>
                              </div>
                            </div>
                            <div aria-label="Vector" className="absolute text-left left-[6px] top-[10px] right-[6px] bottom-[9px]">
                              <div className="size-full text-left">
                                <div className="size-full overflow-hidden text-left">
                                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F813bb2f53b27d561c5014a2db5e4b5da385249d6.svg?generation=1763130270158331&amp;alt=media" className="block size-full" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Procreate" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="Image" className="absolute text-left w-[74px] left-[-3px] top-[47%] aspect-[1.22277_/_1] translate-y-[-50%] z-[1] shrink-[0]">
                            <div className="absolute text-left left-0 top-0 right-0 bottom-0">
                              <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb56b64eae4bcbada4f15b5d5c553d067b76f8222.png%3Fscale-down-to=512?generation=1763130270149283&amp;alt=media" className="block size-full object-cover overflow-clip text-left aspect-[auto_2503_/_2047]" />
                            </div>
                          </div>
                          <div aria-label="procreate" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]" style={{"order":"11"}}></div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Figma" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="figma" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F727425c7c236190ceedea9935111b55752e40c58.svg?generation=1763130270164553&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Framer" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="framer" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F558f9ac0531fb801fa58454ad5e71ac6db78da41.svg?generation=1763130270050665&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Procreate" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="Image" className="absolute text-left w-[74px] left-[-3px] top-[47%] aspect-[1.22277_/_1] translate-y-[-50%] z-[1] shrink-[0]">
                            <div className="absolute text-left left-0 top-0 right-0 bottom-0">
                              <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb56b64eae4bcbada4f15b5d5c553d067b76f8222.png%3Fscale-down-to=512?generation=1763130270149283&amp;alt=media" className="block size-full object-cover overflow-clip text-left aspect-[auto_2503_/_2047]" />
                            </div>
                          </div>
                          <div aria-label="procreate" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]" style={{"order":"11"}}></div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Framer" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="framer" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F558f9ac0531fb801fa58454ad5e71ac6db78da41.svg?generation=1763130270050665&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Figma" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="figma" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F727425c7c236190ceedea9935111b55752e40c58.svg?generation=1763130270164553&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Photoshop" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_photoshop" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F2a6272a725e0614b9d8b107b01f826525085f4dc.svg?generation=1763130270074399&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Illustrator" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_illustrator" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fc9c1d2dd8898e229186f0cc7b5a3168600b87807.svg?generation=1763130270149268&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="After Effects" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_after_effects" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]">
                            <div aria-label="bg" className="absolute text-left left-[2px] top-[2px] right-[2px] bottom-[2px]">
                              <div className="size-full text-left">
                                <div className="size-full overflow-hidden text-left">
                                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe1d6f32e484f525db95dee30625a1e5c16bd6c94.svg?generation=1763130270145882&amp;alt=media" className="block size-full" />
                                </div>
                              </div>
                            </div>
                            <div aria-label="Vector" className="absolute text-left left-[6px] top-[10px] right-[6px] bottom-[9px]">
                              <div className="size-full text-left">
                                <div className="size-full overflow-hidden text-left">
                                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F813bb2f53b27d561c5014a2db5e4b5da385249d6.svg?generation=1763130270158331&amp;alt=media" className="block size-full" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Procreate" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="Image" className="absolute text-left w-[74px] left-[-3px] top-[47%] aspect-[1.22277_/_1] translate-y-[-50%] z-[1] shrink-[0]">
                            <div className="absolute text-left left-0 top-0 right-0 bottom-0">
                              <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb56b64eae4bcbada4f15b5d5c553d067b76f8222.png%3Fscale-down-to=512?generation=1763130270149283&amp;alt=media" className="block size-full object-cover overflow-clip text-left aspect-[auto_2503_/_2047]" />
                            </div>
                          </div>
                          <div aria-label="procreate" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]" style={{"order":"11"}}></div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Figma" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="figma" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F727425c7c236190ceedea9935111b55752e40c58.svg?generation=1763130270164553&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Framer" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="framer" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F558f9ac0531fb801fa58454ad5e71ac6db78da41.svg?generation=1763130270050665&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Procreate" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="Image" className="absolute text-left w-[74px] left-[-3px] top-[47%] aspect-[1.22277_/_1] translate-y-[-50%] z-[1] shrink-[0]">
                            <div className="absolute text-left left-0 top-0 right-0 bottom-0">
                              <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb56b64eae4bcbada4f15b5d5c553d067b76f8222.png%3Fscale-down-to=512?generation=1763130270149283&amp;alt=media" className="block size-full object-cover overflow-clip text-left aspect-[auto_2503_/_2047]" />
                            </div>
                          </div>
                          <div aria-label="procreate" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]" style={{"order":"11"}}></div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Framer" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="framer" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F558f9ac0531fb801fa58454ad5e71ac6db78da41.svg?generation=1763130270050665&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Figma" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="figma" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F727425c7c236190ceedea9935111b55752e40c58.svg?generation=1763130270164553&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Photoshop" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_photoshop" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F2a6272a725e0614b9d8b107b01f826525085f4dc.svg?generation=1763130270074399&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Illustrator" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_illustrator" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fc9c1d2dd8898e229186f0cc7b5a3168600b87807.svg?generation=1763130270149268&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="After Effects" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="adobe_after_effects" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]">
                            <div aria-label="bg" className="absolute text-left left-[2px] top-[2px] right-[2px] bottom-[2px]">
                              <div className="size-full text-left">
                                <div className="size-full overflow-hidden text-left">
                                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe1d6f32e484f525db95dee30625a1e5c16bd6c94.svg?generation=1763130270145882&amp;alt=media" className="block size-full" />
                                </div>
                              </div>
                            </div>
                            <div aria-label="Vector" className="absolute text-left left-[6px] top-[10px] right-[6px] bottom-[9px]">
                              <div className="size-full text-left">
                                <div className="size-full overflow-hidden text-left">
                                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F813bb2f53b27d561c5014a2db5e4b5da385249d6.svg?generation=1763130270158331&amp;alt=media" className="block size-full" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Procreate" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="Image" className="absolute text-left w-[74px] left-[-3px] top-[47%] aspect-[1.22277_/_1] translate-y-[-50%] z-[1] shrink-[0]">
                            <div className="absolute text-left left-0 top-0 right-0 bottom-0">
                              <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb56b64eae4bcbada4f15b5d5c553d067b76f8222.png%3Fscale-down-to=512?generation=1763130270149283&amp;alt=media" className="block size-full object-cover overflow-clip text-left aspect-[auto_2503_/_2047]" />
                            </div>
                          </div>
                          <div aria-label="procreate" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]" style={{"order":"11"}}></div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Figma" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="figma" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F727425c7c236190ceedea9935111b55752e40c58.svg?generation=1763130270164553&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div aria-label="Tools" className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Framer" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="framer" className="relative text-left w-10 h-10 shrink-[0]">
                            <div className="size-full text-left">
                              <div className="size-full overflow-hidden text-left">
                                <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F558f9ac0531fb801fa58454ad5e71ac6db78da41.svg?generation=1763130270050665&amp;alt=media" className="block size-full" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-none text-left w-[74px] h-[72px]">
                      <div className="relative text-left w-[74px] h-[72px]">
                        <div aria-label="Procreate" className="items-center flex size-full justify-center overflow-hidden relative text-left bg-[rgb(25,_26,_35)] gap-[10px] pt-[17px] pr-[21px] pb-[17px] pl-[21px] rounded-[1.1875rem]">
                          <div aria-label="Image" className="absolute text-left w-[74px] left-[-3px] top-[47%] aspect-[1.22277_/_1] translate-y-[-50%] z-[1] shrink-[0]">
                            <div className="absolute text-left left-0 top-0 right-0 bottom-0">
                              <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb56b64eae4bcbada4f15b5d5c553d067b76f8222.png%3Fscale-down-to=512?generation=1763130270149283&amp;alt=media" className="block size-full object-cover overflow-clip text-left aspect-[auto_2503_/_2047]" />
                            </div>
                          </div>
                          <div aria-label="procreate" className="aspect-square overflow-hidden relative text-left w-10 gap-[0px] shrink-[0]" style={{"order":"11"}}></div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
          <div aria-label="light rays" className="overflow-hidden pointer-events-none absolute h-[1823px] left-[-324px] top-[-704px] right-[-160px] blur-lg -rotate-58 z-[3] shrink-[0] opacity-[0]">
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-9 h-[1865px] left-[calc(49.75%-18px)] top-[-352px] origin-[100%_0%] z-[1] opacity-[0.394716]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-[22px] left-[calc(49.5%-11px)] top-[-357px] bottom-[147px] origin-[100%_0%] rotate-25 z-[1] opacity-[0.8572]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-6 left-[calc(49.5%-12px)] top-[-354px] bottom-[-7px] origin-[100%_0%] rotate-11 z-[1]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-[25px] left-[calc(49.5833%-12.5px)] top-[-350px] bottom-[-128px] origin-[100%_0%] -rotate-12 z-[1]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-[35px] left-[calc(50%-17.5px)] top-[-352px] bottom-[-920px] origin-[100%_0%] -rotate-24 z-[1]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-[37px] left-[calc(49.4167%-18.5px)] top-[-348px] bottom-[-164px] origin-[100%_0%] -rotate-18 z-[1] opacity-[0.5]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-4 left-[calc(49.8333%-8px)] top-[-352px] bottom-[-296px] origin-[100%_0%] -rotate-5 z-[1] opacity-[0.7215]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-[11px] left-[calc(49.75%-5.5px)] top-[-352px] bottom-[-121px] origin-[100%_0%] -rotate-3 z-[1]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-[14px] left-[calc(49.75%-7px)] top-[-354px] bottom-[29px] origin-[100%_0%] rotate-18 z-[1]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Ray" className="overflow-hidden pointer-events-none absolute w-[14px] left-[calc(49.6667%-7px)] top-[-353px] bottom-[-121px] origin-[100%_0%] rotate-6 z-[1]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Light Source" className="overflow-hidden pointer-events-none absolute w-[1198px] left-[calc(50%-599px)] top-[-352px] bottom-[-46px] z-[1] opacity-[0.13]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Light Source" className="overflow-hidden pointer-events-none absolute w-[865px] h-[929px] left-[calc(50%-432.5px)] top-[-252px] z-[1] opacity-[0.13]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
            <div aria-label="Light Source" className="overflow-hidden pointer-events-none absolute w-[778px] h-[639px] left-[calc(50%-389px)] top-[-393px] z-[1] opacity-[0.13]" style={{"backgroundImage":"radial-gradient(50% 50%, rgba(255, 255, 255, 0.6) 0%, rgba(171, 171, 171, 0) 100%)"}}></div>
          </div>
          <div aria-label="overlay" className="overflow-hidden absolute h-[1118px] left-0 right-0 bottom-0 z-[1] shrink-[0]" style={{"backgroundImage":"linear-gradient(0deg, rgb(10, 10, 10) 0%, rgba(10, 10, 10, 0) 100%)"}}></div>
        </section>
        <div aria-label="Main" className="items-center flex flex-col h-min justify-start sticky w-[1401px] top-[-4px] gap-[0px] z-[1] shrink-[0]">
          <div aria-label="Scroll Anim Cont" className="items-center flex flex-col justify-start relative w-full h-[4400px] gap-[0px] shrink-[0]">
            <div aria-label="Sitcky" className="items-center flex flex-col h-screen justify-center overflow-hidden sticky w-full top-0 gap-[0px] z-[1] shrink-[0]">
              <div aria-label="Hero" className="items-center flex flex-col h-screen justify-center relative w-[1200px] gap-[10px] shrink-[0]">
                <div aria-label="Images Wrap" className="relative w-[1200px] h-[800px] shrink-[0]" style={{"transform":"perspective(1200px)"}}>
                  <div className="items-center flex flex-col size-min justify-center absolute left-[-77px] top-[178px] gap-[10px]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                    <div aria-label="01" className="relative w-[163px] aspect-[0.980392_/_1] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F72805aa7c6efe35a26a374a9726776f389558b66.jpg%3Fwidth=600&amp;height=612?generation=1763130270271374&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_612]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex flex-col size-min justify-center absolute left-48 top-[168px] gap-[10px]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                    <div aria-label="03" className="relative w-[129px] h-[103px] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F8caa4ebe32cc91fb0a2badbc4ab20deefe4f12be.jpg%3Fscale-down-to=512&amp;width=600&amp;height=428?generation=1763130270309350&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_428]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex flex-col size-min justify-center absolute left-[286px] top-[37px] gap-[10px]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                    <div aria-label="02" className="relative w-[159px] aspect-[1.07335_/_1] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F08e29d410c7e5111ffa9f7362807722cccf2ffca.jpg%3Fscale-down-to=512&amp;width=600&amp;height=559?generation=1763130270281278&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_559]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex flex-col size-min justify-center absolute top-[86px] right-[308px] gap-[10px]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                    <div aria-label="04" className="relative w-[121px] h-[136px] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5263cbf86690f3829fda6098a81d153387c4f7ae.jpg%3Fwidth=600&amp;height=661?generation=1763130270310028&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_661]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex flex-col size-min justify-center absolute top-[87px] right-[-2px] gap-[10px]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                    <div aria-label="05" className="relative w-[142px] aspect-[1.42857_/_1] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5b99ed65e420b7f90f82c09c0f1d18b322379edd.jpg%3Fscale-down-to=512&amp;width=600&amp;height=420?generation=1763130270350835&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_420]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex flex-col size-min justify-center absolute right-[136px] bottom-[325px] gap-[10px]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                    <div aria-label="06" className="relative w-[196px] aspect-[0.921659_/_1] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4fabe75974dfc4ffd1f9c8e5776b35bbc5b3bd73.jpg%3Fwidth=600&amp;height=651?generation=1763130270354455&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_651]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex size-min justify-center absolute top-[67%] right-1 gap-[10px] translate-y-[-50%]">
                    <div aria-label="07" className="relative w-24 aspect-[1.02916_/_1] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbd4570a735b07f90a26d518e29e4c503618c2605.jpg%3Fscale-down-to=512&amp;width=600&amp;height=583?generation=1763130270317917&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_583]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex flex-col size-min justify-center absolute right-[236px] bottom-[68px] gap-[10px]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                    <div aria-label="08" className="relative w-[151px] aspect-[1.40187_/_1] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Faf00982634b5eb9db02086b35f218e9370c1eb09.jpg%3Fscale-down-to=512&amp;width=600&amp;height=428?generation=1763130270333806&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_428]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex size-min justify-center absolute left-[51%] top-[106%] gap-[10px] translate-x-[-50%] translate-y-[-50%]">
                    <div aria-label="09" className="relative w-[122px] h-[168px] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa44ec99e5cb4d3842a500d4a66614c8735e09e7c.jpg%3Fscale-down-to=512&amp;width=600&amp;height=417?generation=1763130270341160&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_417]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex size-min justify-center absolute left-[14%] top-[83%] gap-[10px] translate-x-[-50%] translate-y-[-50%]">
                    <div aria-label="10" className="relative w-[187px] h-[163px] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb90e8ca43223833065f36823e7b23d4483fe9d48.jpg%3Fscale-down-to=512&amp;width=600&amp;height=519?generation=1763130270365740&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_519]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex size-min justify-center absolute left-[31%] top-[74%] gap-[10px] translate-x-[-50%] translate-y-[-50%]">
                    <div aria-label="11" className="relative w-[103px] h-[94px] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fdca4ee9de536c1f8a3492a9f7ca910323428ccf0.jpg%3Fscale-down-to=512&amp;width=600&amp;height=544?generation=1763130270414481&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_600_/_544]" />
                      </div>
                    </div>
                  </div>
                  <div className="items-center flex size-min justify-center absolute left-[17%] top-[54%] gap-[10px] translate-x-[-50%] translate-y-[-50%]">
                    <div aria-label="12" className="relative w-[86px] h-[70px] z-[1] shrink-[0]" style={{"transform":"rotate3d(0, 1, 0, 90deg)"}}>
                      <div className="absolute left-0 top-0 right-0 bottom-0">
                        <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F29ed23127662a148a0f5080e2fce86422d713655.svg%3Fwidth=24&amp;height=24?generation=1763130270432342&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_24_/_24]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div aria-label="Text Fade" className="items-center flex flex-col h-screen justify-center overflow-hidden absolute w-min left-[50%] top-[50%] gap-[10px] translate-x-[-50%] translate-y-[-50%] z-[1] shrink-[0] opacity-[0]">
                  <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                    <p className="text-white text-[44px] leading-[52.8px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Designing experiences</p>
                  </div>
                </div>
                <div aria-label="Text Move Left" className="items-center flex justify-center overflow-hidden absolute w-[140px] left-[451px] top-[120px] bottom-0 gap-[10px] z-[1] shrink-[0]">
                  <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                    <p className="text-white text-[44px] leading-[52.8px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>for real</p>
                  </div>
                </div>
                <div aria-label="Text Move Right" className="items-center flex justify-center overflow-hidden absolute w-[140px] top-[120px] right-[451px] bottom-0 gap-[10px] z-[1] shrink-[0]">
                  <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                    <p className="text-white text-[44px] leading-[52.8px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>impact</p>
                  </div>
                </div>
              </div>
              <div aria-label="Image Zoom" className="h-screen overflow-hidden absolute left-0 top-0 right-0 z-[1] shrink-[0]">
                <div className="absolute left-0 top-0 right-0 bottom-0">
                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F3ac4c936ab394fb1012e176ebf23b1994a1f934e.webp%3Fwidth=1920&amp;height=1246?generation=1763130270467857&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_1920_/_1246]" />
                </div>
                <div aria-label="Cut" className="absolute left-0 top-0 right-0 bottom-0 gap-[10px] z-[3]">
                  <div className="absolute left-0 top-0 right-0 bottom-0">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbd25d79f9fc7e7a1cdf7251f199894efe8a6606d.png%3Fwidth=1280&amp;height=830?generation=1763130270463241&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_1280_/_830]" />
                  </div>
                </div>
                <div aria-label="Cut" className="absolute left-0 top-0 right-0 bottom-0 gap-[10px] z-[4]">
                  <div className="absolute left-0 top-0 right-0 bottom-0">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbd25d79f9fc7e7a1cdf7251f199894efe8a6606d.png%3Fwidth=1280&amp;height=830?generation=1763130270463241&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_1280_/_830]" />
                  </div>
                </div>
                <div aria-label="Cut" className="absolute left-0 top-0 right-0 bottom-0 gap-[10px] z-[5]">
                  <div className="absolute left-0 top-0 right-0 bottom-0">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbd25d79f9fc7e7a1cdf7251f199894efe8a6606d.png%3Fwidth=1280&amp;height=830?generation=1763130270463241&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_1280_/_830]" />
                  </div>
                </div>
                <div aria-label="Cut" className="absolute left-0 top-0 right-0 bottom-0 gap-[10px] z-[6]">
                  <div className="absolute left-0 top-0 right-0 bottom-0">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbd25d79f9fc7e7a1cdf7251f199894efe8a6606d.png%3Fwidth=1280&amp;height=830?generation=1763130270463241&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_1280_/_830]" />
                  </div>
                </div>
                <div aria-label="Cut" className="absolute left-0 top-0 right-0 bottom-0 gap-[10px] z-[7]">
                  <div className="absolute left-0 top-0 right-0 bottom-0">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbd25d79f9fc7e7a1cdf7251f199894efe8a6606d.png%3Fwidth=1280&amp;height=830?generation=1763130270463241&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_1280_/_830]" />
                  </div>
                </div>
                <div aria-label="Cut" className="items-center flex flex-col justify-center absolute left-0 top-0 right-0 bottom-0 gap-[12px] z-[8]">
                  <div className="absolute left-0 top-0 right-0 bottom-0">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F97e75c9d5be349f34327b42d949078dc3fc51204.jpeg%3Fwidth=960&amp;height=1280?generation=1763130270492635&amp;alt=media" className="block size-full object-cover overflow-clip aspect-[auto_960_/_1280]" />
                  </div>
                  <div aria-label="Featuring" className="items-center flex justify-center relative w-min h-12 gap-[10px] shrink-[0]">
                    <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                      <p className="text-white text-[54px] leading-[64.8px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>If you have scrolled this far</p>
                    </div>
                  </div>
                  <div aria-label="Around" className="items-center flex justify-center relative w-min h-12 gap-[10px] shrink-[0]">
                    <div className="flex flex-col justify-start relative whitespace-pre shrink-[0]">
                      <p className="text-white text-[54px] leading-[64.8px]" style={{"fontFamily":"Inter, \"Inter Placeholder\", sans-serif","textDecoration":"rgb(255, 255, 255)"}}>might as well hire me xD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden relative w-full h-[88px] bg-[rgb(5,_5,_5)] shrink-[0] opacity-[0]"></div>
            <div aria-label="BG Images Zoom" className="overflow-hidden relative w-full h-[1586px] bg-[rgba(255,_0,_161,_0.15)]/15 z-[3] shrink-[0] opacity-[0]"></div>
            <div aria-label="Text Fade" className="overflow-hidden absolute h-[205px] left-0 top-[1350px] right-0 bg-[rgba(255,_0,_225,_0.15)]/15 z-[3] shrink-[0] opacity-[0]"></div>
            <div aria-label="Left text" className="overflow-hidden absolute h-[1218px] left-0 right-0 bottom-[1465px] bg-[rgba(255,_71,_71,_0.15)]/15 z-[4] shrink-[0] opacity-[0]"></div>
            <div aria-label="Right text" className="overflow-hidden absolute h-[1218px] left-0 right-0 bottom-[1465px] bg-[rgba(0,_147,_252,_0.15)]/15 z-[4] shrink-[0] opacity-[0]"></div>
            <div aria-label="Featuring" className="overflow-hidden absolute h-[798px] left-0 top-[2876px] right-0 bg-[rgba(255,_38,_0,_0.15)]/15 z-[5] shrink-[0] opacity-[0]"></div>
            <div aria-label="Curators" className="overflow-hidden absolute h-[798px] left-0 top-[3024px] right-0 bg-[rgba(124,_242,_78,_0.15)]/15 z-[5] shrink-[0] opacity-[0]"></div>
            <div aria-label="From" className="overflow-hidden absolute h-[798px] left-0 top-[3175px] right-0 bg-[rgba(106,_255,_0,_0.15)]/15 z-[5] shrink-[0] opacity-[0]"></div>
            <div aria-label="Around" className="overflow-hidden absolute h-[798px] left-0 top-[3350px] right-0 bg-[rgba(0,_255,_162,_0.15)]/15 z-[5] shrink-[0] opacity-[0]"></div>
            <div aria-label="The" className="overflow-hidden absolute h-[797px] left-0 top-[3491px] right-0 bg-[rgba(250,_32,_185,_0.15)]/15 z-[5] shrink-[0] opacity-[0]"></div>
            <div aria-label="World" className="overflow-hidden absolute h-[798px] left-0 top-[3624px] right-0 bg-[rgba(38,_19,_15,_0.15)]/15 z-[5] shrink-[0] opacity-[0]"></div>
            <div aria-label="Magic" className="overflow-hidden absolute h-[1906px] left-0 top-[1717px] right-0 bg-[rgb(31,_46,_242)] z-[1] shrink-[0] opacity-[0]"></div>
          </div>
        </div>
        <div className="contents">
          <div className="fixed w-[840px] left-[50%] top-[25px] max-w-[840px] translate-x-[-50%] z-[8]">
            <nav aria-label="Desktop" className="items-center flex justify-center max-w-full relative w-full h-16 backdrop-blur-md bg-[rgba(17,_17,_17,_0.7)]/70 gap-[0px] rounded-4xl after:border after:size-full after:pointer-events-none after:absolute after:left-0 after:top-0 after:border-white/10 after:content-[&quot;&quot;] after:rounded-4xl">
              <div aria-label="Nav Wrapper" className="items-center flex grow h-full justify-start relative w-px basis-0 gap-[32px] max-w-[1350px] pt-0 pr-10 pb-0 pl-10 shrink-[0]">
                <div aria-label="Wrapper" className="items-center flex grow h-min justify-start relative w-px basis-0 gap-[10px] shrink-[0]">
                  <div aria-label="Nav / Nav Link" className="items-center flex justify-start overflow-hidden relative w-min h-[39px] gap-[6px] pt-[6px] pr-3 pb-[6px] pl-3 shrink-[0]">
                    <div className="flex flex-col justify-start relative whitespace-pre z-[1] shrink-[0]">
                      <p className="font-medium text-white/60 text-[16px] leading-[32px]" style={{"fontFamily":"\"Plus Jakarta Sans\", \"Plus Jakarta Sans Placeholder\", sans-serif","textDecoration":"rgba(255, 255, 255, 0.6)"}}>Muhammad Hamza Ayaz</p>
                    </div>
                  </div>
                </div>
                <div aria-label="Right Links" className="items-center flex size-min justify-center relative gap-[16px] shrink-[0]">
                  <nav aria-label="nav links" className="items-center flex size-min justify-center relative gap-[8px] shrink-[0]">
                    <div className="relative shrink-[0]">
                      <a href="https://left-page-950432.framer.app/contact-me" aria-label="Large" className="items-center flex justify-start overflow-hidden relative w-min h-16 text-[rgb(0,_0,_238)] gap-[6px] pt-[6px] pr-3 pb-[6px] pl-3" style={{"textDecoration":"rgb(0, 0, 238)"}}>
                        <div className="flex flex-col justify-start relative whitespace-pre z-[1] shrink-[0]">
                          <p className="font-medium text-white/60 text-[16px] leading-[32px]" style={{"fontFamily":"\"Plus Jakarta Sans\", \"Plus Jakarta Sans Placeholder\", sans-serif","textDecoration":"rgba(255, 255, 255, 0.6)"}}>Contact</p>
                        </div>
                      </a>
                    </div>
                    <div className="relative shrink-[0]">
                      <a href="https://left-page-950432.framer.app/" aria-label="Large" className="items-center flex justify-start overflow-hidden relative w-min h-16 text-[rgb(0,_0,_238)] gap-[6px] pt-[6px] pr-3 pb-[6px] pl-3" style={{"textDecoration":"rgb(0, 0, 238)"}}>
                        <div className="flex flex-col justify-start relative whitespace-pre z-[1] shrink-[0]">
                          <p className="font-medium text-white/60 text-[16px] leading-[32px]" style={{"fontFamily":"\"Plus Jakarta Sans\", \"Plus Jakarta Sans Placeholder\", sans-serif","textDecoration":"rgba(255, 255, 255, 0.6)"}}>Projects</p>
                        </div>
                      </a>
                    </div>
                    <div className="relative shrink-[0]">
                      <a href="https://left-page-950432.framer.app/" aria-label="Large" className="items-center flex justify-start overflow-hidden relative w-min h-16 text-[rgb(0,_0,_238)] gap-[6px] pt-[6px] pr-3 pb-[6px] pl-3" style={{"textDecoration":"rgb(0, 0, 238)"}}>
                        <div className="flex flex-col justify-start relative whitespace-pre z-[1] shrink-[0]">
                          <p className="font-medium text-white/60 text-[16px] leading-[32px]" style={{"fontFamily":"\"Plus Jakarta Sans\", \"Plus Jakarta Sans Placeholder\", sans-serif","textDecoration":"rgba(255, 255, 255, 0.6)"}}>Resume</p>
                        </div>
                      </a>
                    </div>
                  </nav>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div></div>
    </div>
    <div className="flex justify-end pointer-events-none fixed w-full bottom-0 p-5 z-[2147483647]">
      <a href="https://www.framer.com/" aria-label="Light" className="block relative w-[140px] h-[38px] text-[rgb(0,_0,_238)] gap-[10px]" style={{"textDecoration":"rgb(0, 0, 238)"}}>
        <div aria-label="Backdrop" className="bottom-px left-px overflow-hidden absolute right-px top-px bg-white shadow-[rgba(0,0,0,0.17)_0px_0.602187px_1.56569px_-1.5px,_rgba(0,0,0,0.14)_0px_2.28853px_5.95019px_-3px,_rgba(0,0,0,0.02)_0px_10px_26px_-4.5px] rounded-[0.625rem]"></div>
        <div aria-label="Content" className="items-center flex size-min justify-start absolute left-[50%] top-[50%] gap-[10px] translate-x-[-50%] translate-y-[-50%]">
          <div className="relative w-3 h-4 shrink-[0]">
            <div aria-label="Logo" className="absolute w-3 left-[50%] top-[-2px] aspect-[0.6_/_1] bg-black translate-x-[-50%]"></div>
          </div>
          <p className="absolute scale-[0.001_0.001]"></p>
          <div aria-label="Text" className="relative w-[97px] aspect-[9.7_/_1] bg-black shrink-[0]"></div>
        </div>
        <div aria-label="Bottom" className="pointer-events-none absolute left-0 top-0 right-0 bottom-0 shadow-[rgb(0,0,0)_0px_0px_0px_1px_inset] opacity-[0.06] rounded-[0.6875rem]"></div>
        <div aria-label="Border" className="pointer-events-none absolute left-0 top-0 right-0 bottom-0 shadow-[rgb(0,0,0)_0px_0px_0px_1px_inset] opacity-[0.04] rounded-[0.6875rem]"></div>
      </a>
    </div>
    <div className="items-center flex fixed right-[10px] bottom-[50%] gap-[8px] translate-y-[50%] z-[2147483647]">
      <span aria-label="Edit Framer Content" className="block font-medium h-fit backdrop-blur-[10px] bg-[rgba(34,_34,_34,_0.8)]/80 shadow-[rgba(0,0,0,0.1)_0px_2px_4px_0px,_rgba(0,0,0,0.05)_0px_1px_0px_0px,_rgba(255,255,255,0.15)_0px_0px_0px_1px] text-white pt-1 pr-2 pb-1 pl-2 opacity-[0] rounded-lg" style={{"fontFamily":"Inter, Inter-Regular, system-ui, Arial, sans-serif","textDecoration":"rgb(255, 255, 255)"}}>Edit Content</span>
      <button className="items-center flex justify-center w-[30px] h-[30px] backdrop-blur-[10px] bg-[rgba(34,_34,_34,_0.8)]/80 shadow-[rgba(0,0,0,0.1)_0px_2px_4px_0px,_rgba(0,0,0,0.05)_0px_1px_0px_0px,_rgba(255,255,255,0.15)_0px_0px_0px_1px] text-white rounded-[0.9375rem]" style={{"textDecoration":"rgb(255, 255, 255)"}}>
        <div className="fill-none overflow-hidden w-[14px] h-[14px]">
          <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Feee7ea03eebf0d92318013bb5966236b5c3f4e04.svg?generation=1763130270492733&amp;alt=media" className="block size-full" />
        </div>
      </button>
    </div>
    <div className="h-screen overflow-clip fixed w-screen left-0 top-0 z-[2147483646]" style={{"clipPath":"circle(1px at calc(100% - 20px) calc(50% + 4px))"}}>
      <div className="text-[16px]" style={{"fontFamily":"\"Times New Roman\""}}>
        <div className="overflow-hidden text-[12px] min-h-[900px]" style={{"fontFamily":"Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\""}}>
          <div role="presentation" className="flex">
            <div className="contents">
              <div className="items-center flex flex-col size-full justify-center absolute left-0 top-0 bg-black/70 gap-[10px]">
                <div className="items-center flex flex-col h-min justify-center w-[220px] backdrop-blur-[20px] bg-[rgba(17,_17,_17,_0.9)]/90 shadow-[rgba(255,255,255,0.1)_0px_0px_0px_1px,_rgba(0,0,0,0.2)_0px_10px_20px_0px] gap-[10px] p-[10px] z-[2147483647] shrink-[0] rounded-[1.125rem]">
                  <div className="items-stretch flex flex-col justify-start absolute top-0 right-0 text-[rgb(153,_153,_153)] gap-[10px] p-[15px] shrink-[0]" style={{"textDecoration":"rgb(153, 153, 153)"}}>
                    <div className="fill-none overflow-hidden w-[10px] h-[10px]">
                      <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd6213320acb9fd6e6ea00fe056aa251840773353.svg?generation=1763130270489910&amp;alt=media" className="block size-full" />
                    </div>
                  </div>
                  <div className="items-center flex flex-col justify-center gap-[15px] p-[10px] shrink-[0]">
                    <img alt="Framer Logo" src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F996827c365f0e29e298290752f7125e20dfcaa88.png?generation=1762002597098169&amp;alt=media" className="block overflow-clip w-9 h-9 aspect-[auto_36_/_36]" />
                    <div className="items-center flex flex-col justify-center gap-[5px] shrink-[0]">
                      <span className="block font-semibold text-center whitespace-pre text-white text-[13px] leading-[15.6px]" style={{"textDecoration":"rgb(255, 255, 255)"}}>Edit Page</span>
                      <p className="text-center text-[rgb(153,_153,_153)] text-[13px] leading-[18.2px]" style={{"textDecoration":"rgb(153, 153, 153)"}}>Edit the page directly in the browser, without opening the app.</p>
                    </div>
                  </div>
                  <div className="items-stretch flex justify-start w-full gap-[10px] shrink-[0]">
                    <div className="w-full">
                      <button className="inline-block font-semibold relative text-center w-full h-[30px] bg-white/15 text-white text-[13px] pb-px pt-0 pr-2 pl-2 rounded-lg" style={{"textDecoration":"rgb(255, 255, 255)"}}>Learn More</button>
                    </div>
                    <div className="w-full">
                      <button className="inline-block font-semibold relative text-center w-full h-[30px] bg-white text-[rgb(34,_34,_34)] text-[13px] pb-px pt-0 pr-2 pl-2 rounded-lg" style={{"textDecoration":"rgb(34, 34, 34)"}}>Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-screen overflow-clip pointer-events-none fixed w-screen left-0 top-0 opacity-[0]">
            <div className="bg-white text-[16px]" style={{"fontFamily":"\"Times New Roman\""}}>
              <div className="bg-white text-[12px]" style={{"fontFamily":"sans-serif"}}>
                <main></main>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> );
}
