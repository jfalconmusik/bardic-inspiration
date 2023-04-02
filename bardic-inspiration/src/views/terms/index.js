import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function TermsOfService() {
  return (
    <div>
      <nav className="darkNav" aria-label="You are here:" role="navigation">
        <ul class="breadcrumbs">
          <li>
            <Link to="/" style={{ color: "pink" }}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/terms-of-service" style={{ color: "pink" }}>
              Terms of Service
            </Link>
          </li>
          <li>
            <span class="show-for-sr">Current: Terms of Service</span>
          </li>
        </ul>
      </nav>
      <div>
        <div>
          <h1>Bardic Inspiration Terms and Conditions</h1>
          <br></br>
          <p>1. Introduction</p>
          <br></br>
          <div>
            <p>
              These Terms and Conditions (these “Terms”) contained herein on
              this webpage, shall govern your use of this website, including all
              pages within this website (collectively referred to herein below
              as this “Website”). These Terms apply in full force and effect to
              your use of this Website and by using this Website, you expressly
              accept all terms and conditions contained herein in full. You must
              not use this Website, if you have any objection to any of these
              Terms and Conditions.
            </p>
            <br></br>
            <p>2. Intellectual Property Rights</p>
            <br></br>
            <p>
              Other than content you own, which you may have opted to include on
              this Website, under these Terms, Bardic Inspiration and/or its
              licensors own all rights to the intellectual property and material
              contained in this Website, and all such rights are reserved. You
              are granted a limited license only, subject to the restrictions
              provided in these Terms, for purposes of viewing the material
              contained on this Website.
            </p>
            <br></br>
            <p>3. Restrictions</p>
            <br></br>
            <p>
              You are expressly and emphatically restricted from all of the
              following:
            </p>
            <br></br>
            <ul>
              <li>publishing any Website material in any media;</li>
              <li>
                selling, sublicensing and/or otherwise commercializing any
                Website material
              </li>
              <li>publicly performing and/or showing any Website material;</li>
              <li>
                using this Website in any way that is, or may be, damaging to
                this Website;
              </li>
              <li>
                using this Website in any way that impacts user access to this
                Website;
              </li>
              <li>
                using this Website contrary to applicable laws and regulations,
                or in a way that causes, or may cause, harm to the Website, or
                to any person or business entity;
              </li>
              <li>
                engaging in any data mining, data harvesting, data extracting or
                any other similar activity in relation to this Website, or while
                using this Website;
              </li>
              <li>
                using this Website to engage in any advertising or marketing;
              </li>
            </ul>
            <br></br>
            <p>
              Certain areas of this Website are restricted from access by you
              and Bardic Inspiration may further restrict access by you to any
              areas of this Website, at any time, in its sole and absolute
              discretion. Any user ID and password you may have for this Website
              are confidential and you must maintain confidentiality of such
              information.
            </p>
            <br></br>
            <p>4. No warranties</p>
            <br></br>
            <p>
              This Website is provided “as is,” with all faults, and Jiva's
              Originals makes no express or implied representations or
              warranties, of any kind related to this Website or the materials
              contained on this Website. Additionally, nothing contained on this
              Website shall be construed as providing consult or advice to you.
            </p>
            <br></br>
            <p>5. Limitation of liability</p>
            <br></br>
            <p>
              In no event shall Bardic Inspiration, nor any of its officers,
              directors and employees, be liable to you for anything arising out
              of or in any way connected with your use of this Website, whether
              such liability is under contract, tort or otherwise, and Jiva's
              Originals, including its officers, directors and employees shall
              not be liable for any indirect, consequential or special liability
              arising out of or in any way related to your use of this Website.
            </p>
            <br></br>
            <p>6. Indemnification</p>
            <br></br>
            <p>
              You hereby indemnify to the fullest extent Bardic Inspiration from
              and against any and all liabilities, costs, demands, causes of
              action, damages and expenses (including reasonable attorney’s
              fees) arising out of or in any way related to your breach of any
              of the provisions of these Terms.
            </p>
            <br></br>
            <p>7. Severability</p>
            <br></br>
            <p>
              If any provision of these Terms is found to be unenforceable or
              invalid under any applicable law, such unenforceability or
              invalidity shall not render these Terms unenforceable or invalid
              as a whole, and such provisions shall be deleted without affecting
              the remaining provisions herein.
            </p>
            <br></br>
            <p>8. Variation of Terms</p>
            <br></br>
            <p>
              Bardic Inspiration is permitted to revise these Terms at any time
              as it sees fit, and by using this Website you are expected to
              review such Terms on a regular basis to ensure you understand all
              terms and conditions governing use of this Website.
            </p>
            <br></br>
            <p>9. Assignment</p>
            <br></br>
            <p>
              Bardic Inspiration shall be permitted to assign, transfer, and
              subcontract its rights and/or obligations under these Terms
              without any notification or consent required. However, you shall
              not be permitted to assign, transfer, or subcontract any of your
              rights and/or obligations under these Terms.
            </p>
            <br></br>
            <p>10. Entire Agreement</p>
            <br></br>
            <p>
              These Terms, including any legal notices and disclaimers contained
              on this Website, constitute the entire agreement between Jiva's
              Originals and you in relation to your use of this Website, and
              supersede all prior agreements and understandings with respect to
              the same.
            </p>
            <br></br>
            <p>11. Governing Law and Jurisdiction</p>
            <br></br>
            <p>
              These Terms will be governed by and construed in accordance with
              the laws of the State of Louisiana, and you submit to the
              non-exclusive jurisdiction of the state and federal courts located
              in Louisiana for the resolution of any disputes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
