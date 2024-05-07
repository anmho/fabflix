public class Star {
    private String id;
    private String stagename;
    private Integer dateOfBirth;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStagename() {
        return stagename;
    }

    public void setStagename(String stagename) {
        this.stagename = stagename;
    }

    public Integer getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Integer dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    @Override
    public String toString() {
        return "Star{" +
                "id='" + id + '\'' +
                ", stagename='" + stagename + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                '}';
    }
}
