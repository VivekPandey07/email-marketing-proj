import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Link,
  } from "@react-pdf/renderer";
  
  // Styles inspired by the provided resume
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      fontFamily: "Helvetica",
      color: "#111827",
    },
    header: {
      fontSize: 18,
      color: "#6B46C1",
      textAlign: "center",
      marginBottom: 6,
      fontWeight: "bold",
    },
    contactInfo: {
      textAlign: "center",
      fontSize: 9,
      marginBottom: 10,
      color: "#4B5563",
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#6B46C1",
      borderBottom: "1 solid #CBD5E0",
      marginBottom: 5,
      textTransform: "uppercase",
    },
    section: {
      marginBottom: 10,
    },
    jobTitle: {
      fontWeight: "bold",
    },
    date: {
      color: "#718096",
      fontSize: 9,
    },
    bullet: {
      marginLeft: 8,
      marginBottom: 2,
    },
    link: {
      color: "#3182CE",
      textDecoration: "none",
    },
  });
  
  const ResumePDF = ({ data }: { data: any }) => (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>{data.fullName}</Text>
          <Text style={styles.contactInfo}>
            {data.location || ''} • {data.phone || ''} • {data.email}
          </Text>
          {(data.githubUrl || data.linkedInUrl || data.portfolioUrl) && (
            <View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
              {data.githubUrl && <Link src={data.githubUrl} style={styles.link}>GitHub</Link>}
              {data.linkedInUrl && <Link src={data.linkedInUrl} style={styles.link}>LinkedIn</Link>}
              {data.portfolioUrl && <Link src={data.portfolioUrl} style={styles.link}>Portfolio</Link>}
            </View>
          )}
        </View>
  
        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Summary</Text>
            <Text>{data.summary}</Text>
          </View>
        )}
  
        {/* Experience */}
        {data.experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Work Experience</Text>
            {data.experience.map((exp: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <Text style={styles.jobTitle}>
                  {exp.jobTitle}, {exp.company}
                </Text>
                <Text style={styles.date}>
                  {exp.startDate} – {exp.endDate || "Present"}
                </Text>
                {exp.description && (
                  <Text style={styles.bullet}>
                    • {exp.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
  
        {/* Education */}
        {data.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Education</Text>
            {data.education.map((edu: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <Text style={styles.jobTitle}>
                  {edu.degree} in {edu.fieldOfStudy}
                </Text>
                <Text>{edu.institution}</Text>
                <Text style={styles.date}>
                  {edu.startYear} – {edu.endYear} {edu.percentage ? `| GPA: ${edu.percentage}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}
  
        {/* Skills */}
        {data.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Skills</Text>
            <Text>
              {data.skills.map((skill: any) => skill.name).join(", ")}
            </Text>
          </View>
        )}
  
        {/* Projects */}
        {data.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Projects</Text>
            {data.projects.map((proj: any, idx: number) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <Text style={styles.jobTitle}>{proj.title}</Text>
                <Text style={styles.date}>
                  {proj.startDate || "N/A"} – {proj.endDate || "Present"}
                </Text>
                <Text>{proj.description}</Text>
                {proj.technologies && (
                  <Text style={{ marginTop: 2 }}>
                    <Text style={{ fontWeight: "bold" }}>Technologies: </Text>
                    {proj.technologies.join(", ")}
                  </Text>
                )}
                {proj.url && (
                  <Link src={proj.url} style={styles.link}>
                    {proj.url}
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
  
  export default ResumePDF;
  