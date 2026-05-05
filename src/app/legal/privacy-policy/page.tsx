import Link from 'next/link';
import { useTranslations } from '@/lib/translations';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Privacy Policy - NeuroQuest Academy',
  description: 'Privacy policy for NeuroQuest Academy educational platform',
};

export default function PrivacyPolicyPage() {
  const t = useTranslations('EN');
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>
          <span className={styles.backIcon}>←</span>
          Back to Dashboard
        </Link>
        <h1>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: May 5, 2026</p>
      </div>

      <div className={styles.content}>
        <section>
          <h2>1. Introduction</h2>
          <p>
            NeuroQuest Academy ("we," "our," or "us") is committed to protecting the privacy of students, 
            parents, and educators. This Privacy Policy explains how we collect, use, disclose, and 
            safeguard information when you use our AI-powered educational platform.
          </p>
          <p>
            Our platform is designed specifically for children and educational institutions. We comply 
            with applicable privacy laws including COPPA (Children's Online Privacy Protection Act) 
            and FERPA (Family Educational Rights and Privacy Act).
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information Provided by Schools and Parents</h3>
          <ul>
            <li>Student names, ages, and grade levels</li>
            <li>Parent/guardian contact information</li>
            <li>Teacher and administrator accounts</li>
            <li>Class and school organizational data</li>
          </ul>

          <h3>2.2 Information Collected During Use</h3>
          <ul>
            <li>Learning progress and assessment results</li>
            <li>Quiz responses and skill mastery data</li>
            <li>Time spent on activities (for adaptive learning)</li>
            <li>Avatar customization choices</li>
            <li>Self-reported emotional states (optional)</li>
          </ul>

          <h3>2.3 Technical Information</h3>
          <ul>
            <li>Device type and browser information</li>
            <li>Session data and authentication tokens</li>
            <li>Error logs for troubleshooting</li>
          </ul>

          <p className={styles.highlight}>
            <strong>We do NOT collect:</strong> precise geolocation, photos, voice recordings (beyond 
            text-to-speech for accessibility), or sensitive biometric data.
          </p>
        </section>

        <section>
          <h2>3. How We Use AI (Gemma & Gemini)</h2>
          <p>
            Our platform uses Google&apos;s lightweight Gemma4 model and Gemini AI to:
          </p>
          <ul>
            <li>Generate personalized lesson content aligned with IB curriculum</li>
            <li>Provide adaptive explanations based on student performance</li>
            <li>Create tailored practice questions</li>
            <li>Power the AI tutor for real-time assistance</li>
          </ul>
          <p>
            AI processing may occur on Google Cloud infrastructure. Student data is processed 
            only to provide educational services and is not used to train AI models.
          </p>
        </section>

        <section>
          <h2>4. Data Sharing</h2>
          <p>We do not sell student data. Data may be shared only with:</p>
          <ul>
            <li><strong>Schools:</strong> Teachers and admins can view class/student progress</li>
            <li><strong>Parents:</strong> Access to their child&apos;s learning dashboard</li>
            <li><strong>Service Providers:</strong> Google Cloud for AI processing (encrypted)</li>
            <li><strong>Legal Requirements:</strong> When required by law</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <ul>
            <li>All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Firebase Authentication with industry-standard security</li>
            <li>Regular security audits and penetration testing</li>
            <li>Role-based access control for all users</li>
            <li>Audit logs for all data access</li>
          </ul>
        </section>

        <section>
          <h2>6. COPPA Compliance</h2>
          <p>
            For children under 13, we require verifiable parental consent before collecting 
            personal information. Schools can provide consent on behalf of parents as 
            authorized under FERPA.
          </p>
          <ul>
            <li>Parents can review, update, or delete their child&apos;s data</li>
            <li>Parents can revoke consent at any time</li>
            <li>Data retention limited to active accounts + 1 year</li>
          </ul>
        </section>

        <section>
          <h2>7. FERPA Compliance</h2>
          <p>
            NeuroQuest operates as a "school official" under FERPA when deployed through 
            educational institutions. We:
          </p>
          <ul>
            <li>Use student data only for educational purposes</li>
            <li>Do not disclose data to third parties without consent</li>
            <li>Support school oversight and parental access rights</li>
            <li>Maintain data only as long as necessary</li>
          </ul>
        </section>

        <section>
          <h2>8. Data Retention</h2>
          <p>
            Student data is retained while the account is active and for 1 year after 
            account closure for legitimate educational records. Parents can request 
            immediate deletion at any time.
          </p>
        </section>

        <section>
          <h2>9. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your or your child&apos;s personal information</li>
            <li>Request corrections to inaccurate data</li>
            <li>Request deletion of personal information</li>
            <li>Opt out of non-essential data collection</li>
            <li>Receive a portable copy of your data</li>
            <li>File complaints with relevant authorities</li>
          </ul>
          <p>Contact us at: <strong>privacy@ndnanalytics.com</strong></p>
        </section>

        <section>
          <h2>10. Updates to This Policy</h2>
          <p>
            We may update this policy periodically. Material changes will be communicated 
            via email to registered parents/teachers. Continued use after changes constitutes 
            acceptance.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            <strong>NDN Analytics (NeuroQuest)</strong><br />
            Website: <a href="https://www.ndnanalytics.com" target="_blank" rel="noopener noreferrer">www.ndnanalytics.com</a><br />
            Email: <a href="mailto:privacy@ndnanalytics.com">privacy@ndnanalytics.com</a><br />
            Address: Dubai, UAE
          </p>
        </section>
      </div>
    </div>
  );
}
