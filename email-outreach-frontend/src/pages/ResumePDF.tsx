// components/ResumePDF.tsx
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Link,
  } from "@react-pdf/renderer";
  
  // Styles
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      fontFamily: "Helvetica",
      lineHeight: 1.5,
      color: "#111827",
    },
    section: {
      marginBottom: 16,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#4f46e5",
      marginBottom: 4,
    },
    subHeader: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#374151",
      marginBottom: 6,
      borderBottom: "1 solid #e5e7eb",
      paddingBottom: 4,
      textTransform: "uppercase",
    },
    field: {
      marginBottom: 2,
    },
    label: {
      fontWeight: "bold",
    },
    bullet: {
      marginLeft: 8,
      marginBottom: 2,
    },
    url: {
      color: "#2563eb",
      fontSize: 10,
    },
    text: {
      fontSize: 11,
    },
  });
  
  const ResumePDF = ({ data }: { data: any }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>{data.fullName}</Text>
          <Text>{data.email}</Text>
          {data.phone && <Text>{data.phone}</Text>}
        </View>
  
        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Professional Summary</Text>
            <Text style={styles.text}>{data.summary}</Text>
          </View>
        )}
  
        {/* Education */}
        {data.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Education</Text>
            {data.education.map((edu: any, index: number) => (
              <View key={index} style={{ marginBottom: 6 }}>
                <Text style={styles.label}>
                  {edu.degree} in {edu.fieldOfStudy}
                </Text>
                <Text>{edu.institution}</Text>
                <Text>
                  {edu.startYear} – {edu.endYear} | GPA/Score: {edu.percentage}
                </Text>
              </View>
            ))}
          </View>
        )}
  
        {/* Skills */}
        {data.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Skills</Text>
            {data.skills.map((skill: any, index: number) => (
              <Text key={index} style={styles.bullet}>
                • {skill.name} — {skill.level}, {skill.yearsOfExperience} yrs
              </Text>
            ))}
          </View>
        )}
  
        {/* Projects */}
        {data.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.subHeader}>Projects</Text>
            {data.projects.map((proj: any, index: number) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.label}>{proj.title}</Text>
                <Text>{proj.description}</Text>
                {proj.technologies?.length > 0 && (
                  <Text style={styles.text}>
                    <Text style={styles.label}>Technologies:</Text>{" "}
                    {proj.technologies.join(", ")}
                  </Text>
                )}
                {(proj.startDate || proj.endDate) && (
                  <Text style={styles.text}>
                    <Text style={styles.label}>Duration:</Text>{" "}
                    {proj.startDate || "N/A"} - {proj.endDate || "N/A"}
                  </Text>
                )}
                {proj.url && (
                  <Link style={styles.url} src={proj.url}>
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
  