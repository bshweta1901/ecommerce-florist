class Mail:
    def __init__(
        self,
        to,
        subject=None,
        content=None,
        model=None,
        template_code=None,
        cc=None,
        bcc=None,
        mfile_attachments=None,
        file_attachments=None,
    ):
        self.to = to
        self.subject = subject
        self.content = content
        self.model = model if model else {}
        self.template_code = template_code
        self.cc = cc if cc else []
        self.bcc = bcc if bcc else []
        self.mfile_attachments = mfile_attachments if mfile_attachments else []
        self.file_attachments = file_attachments if file_attachments else []
