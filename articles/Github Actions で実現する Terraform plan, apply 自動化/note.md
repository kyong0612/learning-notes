# Github Actions で実現する Terraform plan, apply 自動化

ref: <https://findy-tools.io/products/github-actions/366/285>

```plan.yaml
name: terraform plan
run-name: terraform plan
on:
  pull_request:
    paths:
      - "terraform/**/*.tf"
      - "!terraform/**/README.md"

env:
  # Google Cloud Project情報を定義
  PROJECT_MAPPING: '{ "project-id": "XXXXXXXXX" }'

jobs:
  filter:
    runs-on: ubuntu-latest
    outputs:
      workdirs: ${{ steps.set_workdirs.outputs.workdirs }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            module: terraform/module/**
            project-id: terraform/projects/project-id/**
      - name: Setup working-directory
        id: set_workdirs
        run: |
          if echo "${{ steps.filter.outputs.changes }}" | grep -q 'module' ; then
            echo "Run terraform plan in all projects."
            echo 'workdirs=["project-id"]' >> "$GITHUB_OUTPUT"
          else
            echo "Run terraform plan in changed projects."
            echo "workdirs=${{ toJson(steps.filter.outputs.changes) }}" >> "$GITHUB_OUTPUT"
          fi

  terraform-plan:
    needs: filter
    if: ${{ needs.filter.outputs.workdirs != '[]' }}
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
      pull-requests: write
    strategy:
      fail-fast: false
      matrix:
        project: ${{ fromJSON(needs.filter.outputs.workdirs) }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set Project Number
        id: set_project_num
        shell: bash
        run: |
          echo "PROJECT_ID=${{ matrix.project }}" >> "$GITHUB_ENV"
          echo "PROJECT_NUM=${{ fromJson(env.PROJECT_MAPPING)[matrix.project] }}" >> "$GITHUB_ENV"

      # Composite action
      - name: Setup Terraform with Aqua
        uses: ./.github/actions/setup_terraform
        with:
          aqua_version: v2.31.0
          project_id: ${{ env.PROJECT_ID }}
          workload_identity_provider: "projects/${{ env.PROJECT_NUM }}/locations/global/workloadIdentityPools/github-pool/providers/github-provider"

      - name: Terraform Plan
        id: plan
        run: |
          tfcmt -var "target:${{ matrix.project }}" --config "$(git rev-parse --show-toplevel)"/.github/tfcmt.yaml plan -patch -- terraform plan -no-color -input=false
        working-directory: "./terraform/projects/${{ matrix.project }}"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

```action.yaml
name: Setup 'Terraform'
description: 'Setup Terraform'
inputs:
  aqua_version:
    description: 'The version of Aqua to use'
    required: true
  project_id:
    description: 'The project ID to use'
    required: true
  workload_identity_provider:
    description: 'The workload identity provider to use'
    required: true

runs:
  using: "composite"
  steps:
    - name: auth-google
      uses: google-github-actions/auth@v2
      with:
        project_id: ${{ inputs.project_id }}
        workload_identity_provider: ${{ inputs.workload_identity_provider }}

    # Cache Aqua tools
    - name: Cache Tools
      id: cache-tools
      uses: actions/cache@v4
      with:
        path: ~/.local/share/aquaproj-aqua
        key: cache-tools-${{ hashFiles('aqua.yaml') }}

    # aqua.yamlから取得したパッケージをインストール
    - name: Setup Aqua
      uses: aquaproj/aqua-installer@v3.0.1
      with:
        aqua_version: ${{ inputs.aqua_version }}
        aqua_opts: "" # Lazy install（aqua i -l） がデフォルトで有効になっているため、aqua_optsに空文字を指定して'-l'オプションを取り除く

    - name: Terraform fmt
      id: fmt
      shell: bash
      run: terraform fmt -recursive -check -diff
      continue-on-error: true

    - name: Terraform Init
      id: init
      shell: bash
      run: terraform init
      working-directory: ./terraform/projects/${{ inputs.project_id }}

    - name: Terraform Validate
      id: validate
      shell: bash
      run: terraform validate -no-color
``
